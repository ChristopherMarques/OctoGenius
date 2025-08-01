import { NextRequest, NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { z } from "zod";
import { supabaseAdmin } from "@/lib/supabaseAdmin";

// Schema de validação para a requisição
const diagnosticRequestSchema = z.object({
  subjects: z
    .array(z.string())
    .min(1, "É necessário selecionar pelo menos uma matéria."),
});

// Inicialização do cliente da IA do Google
const genAI = new GoogleGenerativeAI(
  process.env.NEXT_PUBLIC_GOOGLE_GEMINI_API_KEY || ""
);

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const validation = diagnosticRequestSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(
        { error: validation.error.errors[0].message },
        { status: 400 }
      );
    }

    const { subjects: subjectNames } = validation.data;

    // 1. Buscar os IDs das matérias selecionadas no banco de dados
    const { data: subjectData, error: subjectError } = await supabaseAdmin
      .from("subjects")
      .select("id, name")
      .in("name", subjectNames);

    if (subjectError)
      throw new Error(`Erro ao buscar matérias: ${subjectError.message}`);
    if (!subjectData || subjectData.length === 0) {
      return NextResponse.json(
        {
          error:
            "Nenhuma das matérias selecionadas foi encontrada no banco de dados.",
        },
        { status: 404 }
      );
    }

    // 2. Gerar questões com a IA
    const model = genAI.getGenerativeModel({
      model: "gemini-1.5-flash-latest",
      generationConfig: { responseMimeType: "application/json" },
    });

    const prompt = `
      Você é um especialista em criar questões de vestibular no estilo ENEM.
      Gere 5 questões de múltipla escolha (a, b, c, d, e) sobre os seguintes tópicos: ${subjectNames.join(
        ", "
      )}.
      Para cada questão, associe-a a um dos tópicos fornecidos.
      Retorne um JSON contendo uma única chave "questions" cujo valor é uma lista de objetos. Cada objeto representa uma questão e deve ter a seguinte estrutura:
      {
        "subjectName": "O nome da matéria da questão (ex: 'Matemática').",
        "content": "O enunciado completo da questão.",
        "explanation": "Uma breve explicação sobre a resposta correta.",
        "difficulty_level": "Um número de 1 a 5.",
        "alternatives": [
          { "content": "Texto da alternativa A.", "is_correct": false },
          { "content": "Texto da alternativa B.", "is_correct": true },
          { "content": "Texto da alternativa C.", "is_correct": false },
          { "content": "Texto da alternativa D.", "is_correct": false },
          { "content": "Texto da alternativa E.", "is_correct": false }
        ]
      }
      Certifique-se de que apenas uma alternativa tenha "is_correct" como true.
    `;

    const result = await model.generateContent(prompt);
    const response = result.response;
    const text = response.text();
    const cleanedJson = text.replace(/^```json\s*|```$/g, "");
    const generatedQuestionsRaw = JSON.parse(cleanedJson);

    // CORREÇÃO: A IA pode encapsular a lista em um objeto.
    // Esta linha extrai a lista de forma segura.
    const generatedQuestions =
      generatedQuestionsRaw.questions ||
      (Array.isArray(generatedQuestionsRaw) ? generatedQuestionsRaw : []);

    // Validação para garantir que temos uma lista de questões
    if (!Array.isArray(generatedQuestions) || generatedQuestions.length === 0) {
      console.error(
        "AI Response after parsing was not an iterable array:",
        generatedQuestionsRaw
      );
      throw new Error(
        "A IA não retornou uma lista de questões no formato esperado."
      );
    }

    // 3. Salvar as questões e alternativas geradas no banco de dados
    const questionsToReturn = [];

    for (const q of generatedQuestions) {
      const subject = subjectData.find((s) => s.name === q.subjectName);
      if (!subject) continue; // Pula questão se a matéria não for encontrada

      // Insere a questão
      const { data: insertedQuestion, error: questionInsertError } =
        await supabaseAdmin
          .from("questions")
          .insert({
            subject_id: subject.id,
            content: q.content,
            explanation: q.explanation,
            difficulty_level: q.difficulty_level,
            question_type: "multiple_choice",
          })
          .select()
          .single();

      if (questionInsertError)
        throw new Error(
          `Erro ao salvar questão: ${questionInsertError.message}`
        );

      // Prepara as alternativas para inserção
      const alternativesToInsert = q.alternatives.map((alt: any) => ({
        question_id: insertedQuestion.id,
        content: alt.content,
        is_correct: alt.is_correct,
      }));

      // Insere as alternativas
      const { data: insertedAlternatives, error: altInsertError } =
        await supabaseAdmin
          .from("question_alternatives")
          .insert(alternativesToInsert)
          .select();

      if (altInsertError)
        throw new Error(
          `Erro ao salvar alternativas: ${altInsertError.message}`
        );

      // Monta o objeto de retorno para o frontend
      const correctAnswer = insertedAlternatives.find((alt) => alt.is_correct);
      questionsToReturn.push({
        id: insertedQuestion.id,
        statement: insertedQuestion.content,
        alternatives: insertedAlternatives.map((alt) => ({
          id: alt.id,
          text: alt.content,
        })),
        correctAnswerId: correctAnswer?.id,
      });
    }

    return NextResponse.json(questionsToReturn, { status: 200 });
  } catch (error: any) {
    console.error("Erro em generate-diagnostic:", error);
    return NextResponse.json(
      { error: error.message || "Erro interno do servidor." },
      { status: 500 }
    );
  }
}

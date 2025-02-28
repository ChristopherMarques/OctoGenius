"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { useToast } from "@/src/hooks/use-toast";

// Dados simulados para o teste diagnóstico
const questoesDiagnostico = [
  {
    id: 1,
    disciplina: "Matemática",
    enunciado: "Se f(x) = 2x² - 3x + 1, então f(2) é igual a:",
    alternativas: [
      { id: "a", texto: "3" },
      { id: "b", texto: "5" },
      { id: "c", texto: "7" },
      { id: "d", texto: "9" },
      { id: "e", texto: "11" }
    ],
    resposta: "b"
  },
  {
    id: 2,
    disciplina: "Português",
    enunciado: "Assinale a alternativa em que todas as palavras estão grafadas corretamente:",
    alternativas: [
      { id: "a", texto: "exceção, excessão, excesso" },
      { id: "b", texto: "exceção, excesso, excêntrico" },
      { id: "c", texto: "excessão, escesso, excêntrico" },
      { id: "d", texto: "exceção, escesso, exêntrico" },
      { id: "e", texto: "excessão, excesso, excêntrico" }
    ],
    resposta: "b"
  },
  {
    id: 3,
    disciplina: "Física",
    enunciado: "Um corpo de massa 2 kg está inicialmente em repouso. Uma força constante de 4 N é aplicada sobre ele durante 3 segundos. Considerando que não há atrito, a velocidade final do corpo, em m/s, será de:",
    alternativas: [
      { id: "a", texto: "2" },
      { id: "b", texto: "4" },
      { id: "c", texto: "6" },
      { id: "d", texto: "8" },
      { id: "e", texto: "10" }
    ],
    resposta: "c"
  },
  {
    id: 4,
    disciplina: "Química",
    enunciado: "Qual das seguintes substâncias NÃO é um hidrocarboneto?",
    alternativas: [
      { id: "a", texto: "C₂H₆" },
      { id: "b", texto: "C₃H₈" },
      { id: "c", texto: "C₄H₁₀" },
      { id: "d", texto: "C₂H₅OH" },
      { id: "e", texto: "C₆H₆" }
    ],
    resposta: "d"
  },
  {
    id: 5,
    disciplina: "Biologia",
    enunciado: "Qual das seguintes estruturas celulares é responsável pela produção de ATP?",
    alternativas: [
      { id: "a", texto: "Núcleo" },
      { id: "b", texto: "Retículo endoplasmático" },
      { id: "c", texto: "Mitocôndria" },
      { id: "d", texto: "Complexo de Golgi" },
      { id: "e", texto: "Lisossomo" }
    ],
    resposta: "c"
  }
];

export default function DiagnosticoPage() {
  const { toast } = useToast();
  const [questaoAtual, setQuestaoAtual] = useState(0);
  const [respostas, setRespostas] = useState<Record<number, string>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [testeConcluido, setTesteConcluido] = useState(false);

  const progresso = ((questaoAtual + 1) / questoesDiagnostico.length) * 100;

  const handleResposta = (valor: string) => {
    setRespostas({
      ...respostas,
      [questoesDiagnostico[questaoAtual].id]: valor
    });
  };

  const proximaQuestao = () => {
    if (questaoAtual < questoesDiagnostico.length - 1) {
      setQuestaoAtual(questaoAtual + 1);
    } else {
      finalizarTeste();
    }
  };

  const questaoAnterior = () => {
    if (questaoAtual > 0) {
      setQuestaoAtual(questaoAtual - 1);
    }
  };

  const finalizarTeste = () => {
    setIsLoading(true);

    // Simulando processamento do teste
    setTimeout(() => {
      setIsLoading(false);
      setTesteConcluido(true);

      toast({
        title: "Teste diagnóstico concluído!",
        description: "Seu plano de estudos personalizado está sendo gerado.",
      });

      // Redirecionamento após conclusão do teste
      setTimeout(() => {
        window.location.href = "/dashboard";
      }, 3000);
    }, 2000);
  };

  const questaoAtualObj = questoesDiagnostico[questaoAtual];

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1 py-12">
        <div className="container max-w-3xl mx-auto px-4">
          {!testeConcluido ? (
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center mb-2">
                  <div className="text-sm font-medium text-muted-foreground">
                    Questão {questaoAtual + 1} de {questoesDiagnostico.length}
                  </div>
                  <div className="text-sm font-medium text-primary">
                    {questaoAtualObj.disciplina}
                  </div>
                </div>
                <Progress value={progresso} className="h-2" />
                <CardTitle className="mt-6 text-xl">
                  {questaoAtualObj.enunciado}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <RadioGroup
                  value={respostas[questaoAtualObj.id]}
                  onValueChange={handleResposta}
                  className="space-y-4"
                >
                  {questaoAtualObj.alternativas.map((alternativa) => (
                    <div key={alternativa.id} className="flex items-start space-x-2 border p-4 rounded-md hover:bg-muted/50 transition-colors">
                      <RadioGroupItem value={alternativa.id} id={`alternativa-${alternativa.id}`} />
                      <Label htmlFor={`alternativa-${alternativa.id}`} className="flex-1 cursor-pointer">
                        <span className="font-semibold">{alternativa.id.toUpperCase()})</span> {alternativa.texto}
                      </Label>
                    </div>
                  ))}
                </RadioGroup>
              </CardContent>
              <CardFooter className="flex justify-between">
                <Button
                  variant="outline"
                  onClick={questaoAnterior}
                  disabled={questaoAtual === 0}
                >
                  Anterior
                </Button>
                <Button
                  onClick={proximaQuestao}
                  disabled={!respostas[questaoAtualObj.id] || isLoading}
                >
                  {questaoAtual === questoesDiagnostico.length - 1
                    ? (isLoading ? "Finalizando..." : "Finalizar Teste")
                    : "Próxima"}
                </Button>
              </CardFooter>
            </Card>
          ) : (
            <Card className="text-center">
              <CardHeader>
                <CardTitle className="text-2xl">Teste Diagnóstico Concluído!</CardTitle>
                <CardDescription>
                  Obrigado por completar o teste diagnóstico. Estamos analisando suas respostas.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="my-6 flex justify-center">
                  <div className="w-24 h-24 rounded-full border-4 border-primary border-t-transparent animate-spin" />
                </div>
                <p className="text-lg">
                  Seu plano de estudos personalizado está sendo gerado com base no seu desempenho.
                </p>
                <p className="mt-4 text-muted-foreground">
                  Você será redirecionado automaticamente para o seu dashboard em alguns instantes.
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}
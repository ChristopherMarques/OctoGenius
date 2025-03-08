import { DiagnosticQuestion } from "@/types/diagnostic-tests.types";

export const QuestoesDiagnosticoModelo: DiagnosticQuestion[] = [
  {
    id: 1,
    disciplina: "Matemática",
    enunciado: "Se f(x) = 2x² - 3x + 1, então f(2) é igual a:",
    alternativas: [
      { id: "a", texto: "3" },
      { id: "b", texto: "5" },
      { id: "c", texto: "7" },
      { id: "d", texto: "9" },
      { id: "e", texto: "11" },
    ],
    resposta: "b",
  },
  {
    id: 2,
    disciplina: "Português",
    enunciado:
      "Assinale a alternativa em que todas as palavras estão grafadas corretamente:",
    alternativas: [
      { id: "a", texto: "exceção, excessão, excesso" },
      { id: "b", texto: "exceção, excesso, excêntrico" },
      { id: "c", texto: "excessão, escesso, excêntrico" },
      { id: "d", texto: "exceção, escesso, exêntrico" },
      { id: "e", texto: "excessão, excesso, excêntrico" },
    ],
    resposta: "b",
  },
  {
    id: 3,
    disciplina: "Física",
    enunciado:
      "Um corpo de massa 2 kg está inicialmente em repouso. Uma força constante de 4 N é aplicada sobre ele durante 3 segundos. Considerando que não há atrito, a velocidade final do corpo, em m/s, será de:",
    alternativas: [
      { id: "a", texto: "2" },
      { id: "b", texto: "4" },
      { id: "c", texto: "6" },
      { id: "d", texto: "8" },
      { id: "e", texto: "10" },
    ],
    resposta: "c",
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
      { id: "e", texto: "C₆H₆" },
    ],
    resposta: "d",
  },
  {
    id: 5,
    disciplina: "Biologia",
    enunciado:
      "Qual das seguintes estruturas celulares é responsável pela produção de ATP?",
    alternativas: [
      { id: "a", texto: "Núcleo" },
      { id: "b", texto: "Retículo endoplasmático" },
      { id: "c", texto: "Mitocôndria" },
      { id: "d", texto: "Complexo de Golgi" },
      { id: "e", texto: "Lisossomo" },
    ],
    resposta: "c",
  },
];

export const Vestibulares = [
  "ENEM",
  "Vestibular",
  "Fuvest",
  "Unicamp",
  "Unesp",
];

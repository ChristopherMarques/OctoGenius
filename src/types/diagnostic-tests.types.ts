export type DiagnosticAlternative = {
  id: string;
  texto: string;
};

export type DiagnosticQuestion = {
  id: number;
  disciplina: string;
  enunciado: string;
  alternativas: DiagnosticAlternative[];
  resposta: string;
};

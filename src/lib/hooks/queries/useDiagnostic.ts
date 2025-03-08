import { useMutation, useQuery } from "@tanstack/react-query";

export const usePostDiagnostic = (intention_in: string, userId: string) => {
  return useQuery({
    queryKey: ["diagnosticPost", intention_in, userId],
    enabled: !!intention_in && !!userId,
    queryFn: async () => {
      const response = await fetch(`/api/diagnostic`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ intention_in, userId }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          errorData.error || "Erro desconhecido ao buscar diagnóstico"
        );
      }

      return response.json();
    },
    staleTime: 1000 * 60 * 60 * 3, // dados frescos por 3 horas
    refetchOnWindowFocus: false,
  });
};

export const useGetDiagnostic = (userId: string) => {
  return useQuery({
    queryKey: ["diagnosticGet", userId],
    enabled: !!userId,
    queryFn: async () => {
      const response = await fetch(`/api/diagnostic?userId=${userId}`);

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          errorData.error || "Erro desconhecido ao buscar diagnóstico"
        );
      }

      return response.json();
    },
    staleTime: 1000 * 60 * 60 * 3, // dados frescos por 3 horas
    refetchOnWindowFocus: false,
  });
};

export const usePatchDiagnostic = () => {
  return useMutation({
    mutationFn: async ({
      userId,
      questions_answers,
      score,
    }: {
      userId: string;
      questions_answers: Record<string, string>;
      score: number;
    }) => {
      const response = await fetch(`/api/diagnostic`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ userId, questions_answers, score }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          errorData.error || "Erro desconhecido ao atualizar diagnóstico"
        );
      }

      return response.json();
    },
  });
};

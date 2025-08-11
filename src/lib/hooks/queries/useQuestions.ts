import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  CreateQuestionRequest,
  SubmitAnswerRequest,
} from "@/types/api/requests";

export const useQuestions = (subjectId?: string) => {
  return useQuery({
    queryKey: ["questions", subjectId],
    queryFn: async () => {
      const url = subjectId
        ? `/api/questions?subjectId=${subjectId}`
        : "/api/questions";
      const response = await fetch(url);
      const data = await response.json();
      if (!data.success) throw new Error(data.error);
      return data.data;
    },
    staleTime: 1000 * 60 * 5,
    refetchOnWindowFocus: false,
  });
};

export const useCreateQuestion = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (questionData: CreateQuestionRequest) => {
      const response = await fetch("/api/questions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(questionData),
      });
      const data = await response.json();
      if (!data.success) throw new Error(data.error);
      return data.data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["questions"] });
    },
  });
};

export const useSubmitAnswer = (userId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (answerData: SubmitAnswerRequest) => {
      const response = await fetch(`/api/questions/answer?userId=${userId}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(answerData),
      });
      const data = await response.json();
      if (!data.success) throw new Error(data.error);
      return data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["progress"] });
    },
  });
};

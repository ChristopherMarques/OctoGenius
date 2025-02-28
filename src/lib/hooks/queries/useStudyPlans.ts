import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  CreateStudyPlanRequest,
  UpdateStudyPlanRequest,
} from "@/types/api/requests";

export const useStudyPlans = (userId: string) => {
  return useQuery({
    queryKey: ["study-plans", userId],
    queryFn: async () => {
      const response = await fetch(`/api/study/plans?userId=${userId}`);
      const data = await response.json();
      if (!data.success) throw new Error(data.error);
      return data.data;
    },
  });
};

export const useCreateStudyPlan = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (planData: CreateStudyPlanRequest) => {
      const response = await fetch("/api/study/plans", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(planData),
      });
      const data = await response.json();
      if (!data.success) throw new Error(data.error);
      return data.data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({
        queryKey: ["study-plans", data.user_id],
      });
    },
  });
};

export const useUpdateStudyPlan = (planId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (planData: UpdateStudyPlanRequest) => {
      const response = await fetch(`/api/study/plans?planId=${planId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(planData),
      });
      const data = await response.json();
      if (!data.success) throw new Error(data.error);
      return data.data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({
        queryKey: ["study-plans", data.user_id],
      });
    },
  });
};

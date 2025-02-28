import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { UpdateProgressRequest } from "@/types/api/requests";

export const useProgress = (userId: string) => {
  return useQuery({
    queryKey: ["progress", userId],
    queryFn: async () => {
      const response = await fetch(`/api/progress?userId=${userId}`);
      const data = await response.json();
      if (!data.success) throw new Error(data.error);
      return data.data;
    },
  });
};

export const useUpdateProgress = (userId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (progressData: UpdateProgressRequest) => {
      const response = await fetch(`/api/progress?userId=${userId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(progressData),
      });
      const data = await response.json();
      if (!data.success) throw new Error(data.error);
      return data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["progress", userId] });
    },
  });
};

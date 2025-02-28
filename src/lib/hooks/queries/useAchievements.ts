import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

export const useAchievements = (userId: string) => {
  return useQuery({
    queryKey: ["achievements", userId],
    queryFn: async () => {
      const response = await fetch(`/api/achievements?userId=${userId}`);
      const data = await response.json();
      if (!data.success) throw new Error(data.error);
      return data.data;
    },
  });
};

export const useUnlockAchievement = (userId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (achievementId: string) => {
      const response = await fetch(
        `/api/achievements?userId=${userId}&achievementId=${achievementId}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
        }
      );
      const data = await response.json();
      if (!data.success) throw new Error(data.error);
      return data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["achievements", userId] });
    },
  });
};

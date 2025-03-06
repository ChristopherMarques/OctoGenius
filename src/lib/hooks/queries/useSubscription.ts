import { useQuery } from "@tanstack/react-query";

export const useSubscription = (userId?: string) => {
  return useQuery({
    queryKey: ["subscription", userId],
    queryFn: async () => {
      if (!userId) {
        return null;
      }

      const response = await fetch(`/api/users/subscription?user_id=${userId}`);
      const data = await response.json();
      if (!data.success) throw new Error(data.error);
      return data.data;
    },
    enabled: !!userId,
  });
};

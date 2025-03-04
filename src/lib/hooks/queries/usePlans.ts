import { useQuery } from "@tanstack/react-query";

export const usePlans = () => {
  return useQuery({
    queryKey: ["plans"],
    queryFn: async () => {
      const response = await fetch(`/api/plans`);
      const data = await response.json();
      if (!data.success) throw new Error(data.error);
      return data.data;
    },
    staleTime: 1000 * 60 * 60 * 3, // dados frescos por 3 horas
    refetchOnWindowFocus: false,
  });
};

export const usePlan = (planId: string) => {
  return useQuery({
    queryKey: ["plan", planId],
    queryFn: async () => {
      const response = await fetch(`/api/plans?planId=${planId}`);
      const data = await response.json();
      if (!data.success) throw new Error(data.error);
      return data.data;
    },
    staleTime: 1000 * 60 * 60 * 3, // dados frescos por 3 horas
    refetchOnWindowFocus: false,
  });
};

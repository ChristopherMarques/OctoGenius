import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { CreateUserRequest, UpdateUserRequest } from "@/types/api/requests";

export const useUser = (userId: string) => {
  return useQuery({
    queryKey: ["users", userId],
    queryFn: async () => {
      const response = await fetch(`/api/users?userId=${userId}`);
      const data = await response.json();
      if (!data.success) throw new Error(data.error);
      return data.data;
    },
  });
};

export const useCreateUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (userData: CreateUserRequest) => {
      const response = await fetch("/api/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(userData),
      });
      const data = await response.json();
      if (!data.success) throw new Error(data.error);
      return data.data;
    },
    onSuccess: (data) => {
      queryClient.setQueryData(["users", data.id], data);
    },
  });
};

export const useUpdateUser = (userId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (userData: UpdateUserRequest) => {
      const response = await fetch(`/api/users?userId=${userId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(userData),
      });
      const data = await response.json();
      if (!data.success) throw new Error(data.error);
      return data.data;
    },
    onSuccess: (data) => {
      queryClient.setQueryData(["users", userId], data);
    },
  });
};

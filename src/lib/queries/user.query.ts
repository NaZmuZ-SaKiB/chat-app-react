/* eslint-disable react-hooks/rules-of-hooks */
import { useMutation, useQuery } from "@tanstack/react-query";
import axiosClient, { TResponse } from "../axios";
import { z } from "zod";
import { userUpdateSchema } from "../validations/auth.validation";

export const useGetUserByIdQuery = (id: string) =>
  useQuery({
    queryKey: ["user", id],
    queryFn: async () => await axiosClient.get(`/user/${id}`),
  });

export const useGetUserByConversationIdQuery = (id: string) =>
  useQuery({
    queryKey: ["user", id],
    queryFn: async () => await axiosClient.get(`/user/conversation/${id}`),
    refetchOnWindowFocus: false,
  });

export const useSearchUsersQuery = (searchTerm: string) =>
  useQuery({
    queryKey: ["user", searchTerm || "no-search"],
    queryFn: async () => {
      if (!searchTerm) return { data: [] };
      return await axiosClient.get("/user", { params: { searchTerm } });
    },
  });

export const useUserUpdateMutation = () =>
  useMutation({
    mutationFn: async (data: z.infer<typeof userUpdateSchema>) =>
      (await axiosClient.patch("/user", data)) as TResponse,
  });

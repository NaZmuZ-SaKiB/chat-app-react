/* eslint-disable react-hooks/rules-of-hooks */
import { useQuery } from "@tanstack/react-query";
import axiosClient from "../axios";

export const useGetUserByIdQuery = (id: string) =>
  useQuery({
    queryKey: ["user", id],
    queryFn: async () => await axiosClient.get(`/user/${id}`),
  });

export const useGetUserByConversationIdQuery = (id: string) =>
  useQuery({
    queryKey: ["user", id],
    queryFn: async () => await axiosClient.get(`/user/conversation/${id}`),
  });

export const useSearchUsersQuery = (searchTerm: string) =>
  useQuery({
    queryKey: ["user", searchTerm || "no-search"],
    queryFn: async () => {
      if (!searchTerm) return { data: [] };
      return await axiosClient.get("/user", { params: { searchTerm } });
    },
  });

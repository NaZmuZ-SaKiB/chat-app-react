/* eslint-disable react-hooks/rules-of-hooks */
import { useMutation, useQuery } from "@tanstack/react-query";
import axiosClient, { TResponse } from "../axios";

export const useGetSidebarConversationsQuery = () =>
  useQuery({
    queryKey: ["sidebar"],
    queryFn: async () => await axiosClient.get("/user/sidebar"),
  });

export const useGetConversationWith = (id: string) =>
  useQuery({
    queryKey: ["conversation-with", id],
    queryFn: async () => await axiosClient.get(`/conversation/${id}`),
  });

export const useStartConversationMutation = () =>
  useMutation({
    mutationFn: async (data: { id: string; message: string }) =>
      (await axiosClient.post(`/conversation/start/${data.id}`, {
        message: data.message,
      })) as TResponse,
  });

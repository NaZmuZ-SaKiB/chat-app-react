/* eslint-disable react-hooks/rules-of-hooks */

import { useMutation, useQuery } from "@tanstack/react-query";
import axiosClient, { TResponse } from "../axios";

export const useGetMessagesQuery = (id: string, page: number) =>
  useQuery({
    queryKey: ["messages", id],
    queryFn: async () =>
      await axiosClient.get(`/message/${id}`, { params: { page: `${page}` } }),
    refetchOnWindowFocus: false,
  });

export const useSendMessageMutation = () =>
  useMutation({
    mutationFn: async (data: any) =>
      (await axiosClient.post(
        `/message/${data.id}`,
        data?.message
      )) as TResponse,
  });

export const useSeenMessageMutation = () =>
  useMutation({
    mutationFn: async (id: string) =>
      await axiosClient.patch(`/message/${id}/seen`),
  });

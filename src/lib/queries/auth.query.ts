import { useMutation, useQuery } from "@tanstack/react-query";
import axiosClient, { TResponse } from "../axios";

export const useGetMeQuery = () =>
  useQuery({
    queryKey: ["me"],
    queryFn: async () => (await axiosClient.get("/auth/me")) as TResponse,
    refetchOnWindowFocus: false,
  });

export const useSignUpMutation = () =>
  useMutation({
    mutationFn: async (data: any) =>
      (await axiosClient.post("/auth/sign-up", data)) as TResponse,
  });

export const useSignInMutation = () =>
  useMutation({
    mutationFn: async (data: any) =>
      (await axiosClient.post("/auth/sign-in", data)) as TResponse,
  });

export const useChangePasswordMutation = () =>
  useMutation({
    mutationFn: async (data: any) =>
      (await axiosClient.patch("/auth/change-password", data)) as TResponse,
  });

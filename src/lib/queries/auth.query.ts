import { useMutation } from "@tanstack/react-query";
import axiosClient, { TResponse } from "../axios";

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

export const useSignOutMutation = () =>
  useMutation({
    mutationFn: async () =>
      (await axiosClient.post("/auth/sign-out")) as TResponse,
  });

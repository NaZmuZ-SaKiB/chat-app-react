/* eslint-disable @typescript-eslint/ban-ts-comment */
import axios from "axios";

export type TResponse = {
  statusCode: number;
  success: boolean;
  message: string;
  data: any;
};

const axiosClient = axios.create({
  baseURL: `${import.meta.env.VITE_BASE_API_URL}/api`,
  validateStatus: () => true,
  withCredentials: true,
  headers: {
    "Access-Control-Allow-Origin": "*",
  },
});

axiosClient.defaults.headers["Content-Type"] = "application/json";

//@ts-ignore
axiosClient.interceptors.response.use((response) => {
  return response.data as TResponse;
});

export default axiosClient;

/* eslint-disable @typescript-eslint/ban-ts-comment */
import axios from "axios";
import Cookies from "js-cookie";

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

axiosClient.interceptors.request.use(
  (config) => {
    const token = Cookies.get("jwt");
    if (token) {
      config.headers.Authorization = `${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

//@ts-ignore
axiosClient.interceptors.response.use((response) => {
  return response.data as TResponse;
});

export default axiosClient;

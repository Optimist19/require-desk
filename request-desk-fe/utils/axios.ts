import axios from "axios";
import { useRequestDesk } from "@/store";

export const authInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_BASE_URL,
  timeout: 5000,
  withCredentials: true
});

export const apiInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_BASE_URL,
  timeout: 5000,
  withCredentials: true
});

apiInstance.interceptors.request.use((config) => {
  const token = useRequestDesk.getState().accessToken;
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

apiInstance.interceptors.response.use(
  (response) => {
    return response;
  },

  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const response = await authInstance.get("/api/auth/refreshToken");

        const newAccessToken = response.data.accessToken;

        // Update Zustand
        useRequestDesk.getState().setAccessToken(newAccessToken);

        // Put new token on the original request
        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;

        // Try the original request again
        return apiInstance(originalRequest);
      } catch (refreshError) {
        // Refresh token is also invalid/expired
        // useRequestDesk.getState().logOut();

        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

import axios from "axios";
import {useAuthStore} from "../store/useAuthStore.js";
// import {setAuth} from "../store/useAuthStore.js"

const axiosInstance = axios.create({
  baseURL: "http://localhost:3000/api",
  withCredentials: true,
});

axiosInstance.interceptors.request.use((config) => {
  const token = useAuthStore.getState().accessToken;
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

axiosInstance.interceptors.response.use(
  (response) => {
    return response;
  },

  async (error) => {
    const originalRequest = error.config;
    if (error.response.status == 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      const res = await axiosInstance.post("/auth/refresh-token");
      useAuthStore
        .getState()
        .setAuth(res.data.accessToken, useAuthStore.getState().user);
      originalRequest.headers.Authorization = `Bearer ${res.data.accessToken}`;
      return axiosInstance(originalRequest);
    }
   return Promise.reject(error)
  },
);
export default axiosInstance;

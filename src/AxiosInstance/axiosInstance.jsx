import axios from "axios";
import { getItem, clearSession, isSessionValid } from "../Services/storage.service";

const API_BASE_URL = process.env.REACT_APP_API_URL;

const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "ngrok-skip-browser-warning": "true",
    "Content-Type": "application/json",
  },
});

// Track if interceptors are already set up (prevent duplicates)
let interceptorsInitialized = false;

const axiosInterceptor = (logoutCallback) => {
  // Prevent duplicate interceptor registration
  if (interceptorsInitialized) return;
  interceptorsInitialized = true;

  // ─── REQUEST INTERCEPTOR: Attach token + check session validity ───
  axiosInstance.interceptors.request.use(
    (config) => {
      // Public endpoints that don't need session validation (user not logged in yet)
      const publicEndpoints = ["/login", "/forgetPassword", "/verifyOtp", "/reset"];
      const isPublicRequest = publicEndpoints.some((ep) =>
        config.url?.includes(ep)
      );

      // Only check session validity for protected requests
      if (!isPublicRequest && !isSessionValid()) {
        clearSession();
        logoutCallback(null);
        return Promise.reject(new Error("Session expired"));
      }

      const token = getItem("token");
      if (token) {
        config.headers["Authorization"] = token;
      }
      return config;
    },
    (error) => Promise.reject(error)
  );

  // ─── RESPONSE INTERCEPTOR: Handle 401 & 403 ───
  axiosInstance.interceptors.response.use(
    (response) => response,
    (error) => {
      const status = error.response?.status;

      // 401 Unauthorized — token invalid or expired on backend
      if (status === 401) {
        clearSession();
        logoutCallback(null);
      }

      // 403 Forbidden — no permission or banned
      if (status === 403) {
        clearSession();
        logoutCallback(null);
      }

      return Promise.reject(error);
    }
  );
};

export { axiosInstance, axiosInterceptor };

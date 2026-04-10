import axios from "axios";
import { INTERCEPTOR_CONFIG, setupInterceptorsTo } from "./interceptors";

/**
 * Creates an axios instance for a specific service with enhanced interceptors
 * @param {Object} options - Additional interceptor options
 * @param {Object} axiosConfig - Additional axios configuration
 * @returns {Object} Configured axios instance
 */
export const createAxiosInstance = (
  options = {},
  axiosConfig = {}
) => {
  const baseUrl = `${process.env.NEXT_PUBLIC_API_URL}`;

  const instance = axios.create({
    baseURL: baseUrl,
    headers: {
      "Content-Type": "application/json",
    },
    timeout: INTERCEPTOR_CONFIG.REQUEST_TIMEOUT || 1 * 60 * 1000, // Use the centralized timeout or fallback
    ...axiosConfig,
  });

  setupInterceptorsTo(instance, {
    disableErrorToast: true,
    ...options,
  });

  return instance;
};

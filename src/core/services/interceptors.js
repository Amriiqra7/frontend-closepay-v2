/**
 * Interceptor configuration shared by axios instances.
 */
export const INTERCEPTOR_CONFIG = {
    TOAST_COOLDOWN: 2000,
    MAX_RETRY_ATTEMPTS: 0,
    RETRY_DELAY_BASE: 1000,
    REQUEST_TIMEOUT: 1 * 60 * 1000,
    AUTH_REDIRECT_DELAY: 1500,
    DEBUG_MODE: false,
    ENABLE_RETRY: false,
};

const onRequest = (config) => config;

const onRequestError = (error) => Promise.reject(error);

const onResponse = (response) => response;

const createResponseErrorHandler = () => (error) => Promise.reject(error);

/**
 * Create request handler that resolves with response.data.
 */
export const createHandleRequest = () => (request) =>
    new Promise((resolve, reject) => {
        request.then((res) => resolve(res.data)).catch((err) => reject(err));
    });

/**
 * Attach minimal request/response interceptors to an axios instance.
 */
export function setupInterceptorsTo(axiosInstance, options = {}) {
    const config = {
        disableErrorToast: false,
        disableSuccessToast: false,
        disableAuth: false,
        disableRetry: false,
        enablePerformanceMonitoring: false,
        ...options,
    };

    axiosInstance.interceptors.request.use(onRequest, onRequestError);
    axiosInstance.interceptors.response.use(
        onResponse,
        createResponseErrorHandler(config)
    );

    axiosInstance._cleanupInterceptors = () => {};

    axiosInstance._getInterceptorStats = () => ({
        activeRequests: 0,
        toastCooldowns: {},
        config,
    });

    if (INTERCEPTOR_CONFIG.DEBUG_MODE) {
        console.log("Axios interceptors configured:", config);
    }

    return axiosInstance;
}

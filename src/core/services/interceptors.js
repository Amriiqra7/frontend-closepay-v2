/**
 * Interceptor configuration shared by axios instances.
 */
import { getAuthAccessToken } from "./authSession";
import { clearAuthSession } from "./authSession";

export const INTERCEPTOR_CONFIG = {
    TOAST_COOLDOWN: 2000,
    MAX_RETRY_ATTEMPTS: 0,
    RETRY_DELAY_BASE: 1000,
    REQUEST_TIMEOUT: 1 * 60 * 1000,
    AUTH_REDIRECT_DELAY: 1500,
    DEBUG_MODE: false,
    ENABLE_RETRY: false,
};

const createRequestHandler = (options = {}) => (config) => {
    if (options?.disableAuth) {
        return config;
    }

    const hasExplicitAuthorization =
        Boolean(config?.headers?.Authorization) ||
        Boolean(config?.headers?.authorization);
    if (hasExplicitAuthorization) {
        return config;
    }

    const authToken = getAuthAccessToken();
    if (authToken?.authorization) {
        config.headers = {
            ...(config.headers || {}),
            Authorization: authToken.authorization,
        };
    }

    return config;
};

const onRequestError = (error) => Promise.reject(error);

const onResponse = (response) => response;

const createResponseErrorHandler = () => (error) => {
    const statusCode = error?.response?.status;
    const errorType = error?.response?.data?.detail?.type || error?.response?.data?.type;
    const isAuthError = statusCode === 401 || errorType === "AUTHENTICATION_FAILED";

    if (isAuthError && typeof window !== "undefined") {
        clearAuthSession();

        const pathname = window.location?.pathname || "";
        const isFnbRoute = pathname.startsWith("/fnb");
        const redirectTo = isFnbRoute ? "/fnb/login" : "/login";

        if (pathname !== redirectTo) {
            window.location.replace(redirectTo);
        }
    }

    return Promise.reject(error);
};

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

    axiosInstance.interceptors.request.use(createRequestHandler(config), onRequestError);
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

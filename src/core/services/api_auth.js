import { addProps, removeEmptyParams } from "@/config/global";
import { createAxiosInstance } from "./axiosInstances";
import { createHandleRequest } from "./interceptors";

const axiosInstance = createAxiosInstance();
const handleRequest = createHandleRequest();

export const authentication = {
    login: addProps(
        ({ username, password, ...body }) =>
            handleRequest(
                axiosInstance.post(
                    "/authentication/admin/auth/login",
                    removeEmptyParams(body),
                    {
                        auth: {
                            username,
                            password,
                        },
                    }
                )
            ),
        { operationId: "login" }
    ),
    requestCaptcha: addProps(
        ({ accessToken, ...body }) =>
            handleRequest(
                axiosInstance.post(
                    "/authentication/admin/new-device/request_captcha",
                    removeEmptyParams(body),
                    {
                        headers: {
                            Authorization: `Bearer ${accessToken}`,
                        },
                    }
                )
            ),
        { operationId: "request_captcha" }
    ),
    verifyCaptcha: addProps(
        ({ accessToken, ...body }) =>
            handleRequest(
                axiosInstance.post(
                    "/authentication/admin/new-device/verify_captcha",
                    removeEmptyParams(body),
                    {
                        headers: {
                            Authorization: `Bearer ${accessToken}`,
                        },
                    }
                )
            ),
        { operationId: "verify_captcha" }
    ),
};

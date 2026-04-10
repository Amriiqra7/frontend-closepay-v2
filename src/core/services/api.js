import { addProps, removeEmptyParams } from "config/global";
import { createAxiosInstance } from "./axiosInstances";
import { createHandleRequest } from "./interceptors";

// Membuat Axios instance dengan konfigurasi global
export const FEATURE_SIAKAD = "closepay";
const axiosInstance = createAxiosInstance(FEATURE_SIAKAD);
const handleRequest = createHandleRequest();

export const siakadSuperadminCompany = {
    getAll: addProps(
        (params) =>
            handleRequest(
                axiosInstance.get("/superadmin/company/find", {
                    params: removeEmptyParams(params),
                })
            ),
        { operationId: "superadmin_company_find" }
    ),

    getById: addProps(
        (companyId) => handleRequest(axiosInstance.get(`/superadmin/company/get/${companyId}`)),
        { operationId: "superadmin_company_get" }
    ),

    addCredentialClosepay: addProps(
        (companyId, data) => handleRequest(axiosInstance.post(`/superadmin/company/add/credential_closepay/${companyId}`, data)),
        { operationId: "superadmin_company_add_credential_closepay" }
    ),
};
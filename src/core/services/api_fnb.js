import { addProps, removeEmptyParams } from "@/config/global";
import { createAxiosInstance } from "./axiosInstances";
import { createHandleRequest } from "./interceptors";

const axiosInstance = createAxiosInstance();
const handleRequest = createHandleRequest();

export const fnbMenu = {
  find: addProps(
    (params) =>
      handleRequest(
        axiosInstance.get("/fnb/merchant/menu/find", {
          params: removeEmptyParams(params),
        })
      ),
    { operationId: "fnb_merchant_menu_find" }
  ),
  getById: addProps(
    (menuId) => handleRequest(axiosInstance.get(`/fnb/merchant/menu/get/${menuId}`)),
    { operationId: "fnb_merchant_menu_get" }
  ),
  create: addProps(
    (payload) => handleRequest(axiosInstance.post("/fnb/merchant/menu/create", payload)),
    { operationId: "fnb_merchant_menu_create" }
  ),
  update: addProps(
    (menuId, payload) => handleRequest(axiosInstance.put(`/fnb/merchant/menu/update/${menuId}`, payload)),
    { operationId: "fnb_merchant_menu_update" }
  ),
};

export const fnbMenuCategory = {
  combo: addProps(
    (params) =>
      handleRequest(
        axiosInstance.get("/fnb/merchant/menu_category/combo", {
          params: removeEmptyParams(params),
        })
      ),
    { operationId: "fnb_merchant_menu_category_combo" }
  ),
};

export const fnbMenuVariant = {
  find: addProps(
    (params) =>
      handleRequest(
        axiosInstance.get("/fnb/merchant/menu_variant/find", {
          params: removeEmptyParams(params),
        })
      ),
    { operationId: "fnb_merchant_menu_variant_find" }
  ),
  create: addProps(
    (payload) => handleRequest(axiosInstance.post("/fnb/merchant/menu_variant/create", payload)),
    { operationId: "fnb_merchant_menu_variant_create" }
  ),
  update: addProps(
    (variantId, payload) =>
      handleRequest(axiosInstance.put(`/fnb/merchant/menu_variant/update/${variantId}`, payload)),
    { operationId: "fnb_merchant_menu_variant_update" }
  ),
};

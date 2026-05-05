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
  delete: addProps(
    (menuId) => handleRequest(axiosInstance.delete(`/fnb/merchant/menu/delete/${menuId}`)),
    { operationId: "fnb_merchant_menu_delete" }
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
  bulkCreate: addProps(
    (payload) => handleRequest(axiosInstance.post("/fnb/merchant/menu_variant/bulk_create", payload)),
    { operationId: "fnb_merchant_menu_variant_bulk_create" }
  ),
  create: addProps(
    (payload) =>
      handleRequest(
        axiosInstance.post(
          "/fnb/merchant/menu_variant/bulk_create",
          Array.isArray(payload) ? payload : [payload]
        )
      ),
    { operationId: "fnb_merchant_menu_variant_create" }
  ),
  update: addProps(
    (variantId, payload) =>
      handleRequest(axiosInstance.put(`/fnb/merchant/menu_variant/update/${variantId}`, payload)),
    { operationId: "fnb_merchant_menu_variant_update" }
  ),
  delete: addProps(
    (variantId) => handleRequest(axiosInstance.delete(`/fnb/merchant/menu_variant/delete/${variantId}`)),
    { operationId: "fnb_merchant_menu_variant_delete" }
  ),
};

export const fnbMenuAddonGroup = {
  combo: addProps(
    (params) =>
      handleRequest(
        axiosInstance.get("/fnb/merchant/menu_addon_group/combo", {
          params: removeEmptyParams(params),
        })
      ),
    { operationId: "fnb_merchant_menu_addon_group_combo" }
  ),
  find: addProps(
    (params) =>
      handleRequest(
        axiosInstance.get("/fnb/merchant/menu_addon_group/find", {
          params: removeEmptyParams(params),
        })
      ),
    { operationId: "fnb_merchant_menu_addon_group_find" }
  ),
  getById: addProps(
    (addonGroupId) => handleRequest(axiosInstance.get(`/fnb/merchant/menu_addon_group/get/${addonGroupId}`)),
    { operationId: "fnb_merchant_menu_addon_group_get" }
  ),
  delete: addProps(
    (addonGroupId) => handleRequest(axiosInstance.delete(`/fnb/merchant/menu_addon_group/delete/${addonGroupId}`)),
    { operationId: "fnb_merchant_menu_addon_group_delete" }
  ),
  create: addProps(
    (payload) => handleRequest(axiosInstance.post("/fnb/merchant/menu_addon_group/create", payload)),
    { operationId: "fnb_merchant_menu_addon_group_create" }
  ),
  update: addProps(
    (addonGroupId, payload) =>
      handleRequest(axiosInstance.put(`/fnb/merchant/menu_addon_group/update/${addonGroupId}`, payload)),
    { operationId: "fnb_merchant_menu_addon_group_update" }
  ),
};

export const fnbMenuAddonGroupMap = {
  create: addProps(
    (payload) => handleRequest(axiosInstance.post("/fnb/merchant/menu_addon_group_map/create", payload)),
    { operationId: "fnb_merchant_menu_addon_group_map_create" }
  ),
  delete: addProps(
    (mapId) => handleRequest(axiosInstance.delete(`/fnb/merchant/menu_addon_group_map/delete/${mapId}`)),
    { operationId: "fnb_merchant_menu_addon_group_map_delete" }
  ),
  findByMenu: addProps(
    (params) =>
      handleRequest(
        axiosInstance.get("/fnb/merchant/menu_addon_group_map/find_by_menu", {
          params: removeEmptyParams(params),
        })
      ),
    { operationId: "fnb_merchant_menu_addon_group_map_find_by_menu" }
  ),
};

export const fnbMenuAddonItem = {
  find: addProps(
    (params) =>
      handleRequest(
        axiosInstance.get("/fnb/merchant/menu_addon_item/find", {
          params: removeEmptyParams(params),
        })
      ),
    { operationId: "fnb_merchant_menu_addon_item_find" }
  ),
  bulkCreate: addProps(
    (payload) => handleRequest(axiosInstance.post("/fnb/merchant/menu_addon_item/bulk_create", payload)),
    { operationId: "fnb_merchant_menu_addon_item_bulk_create" }
  ),
  update: addProps(
    (addonItemId, payload) =>
      handleRequest(axiosInstance.put(`/fnb/merchant/menu_addon_item/update/${addonItemId}`, payload)),
    { operationId: "fnb_merchant_menu_addon_item_update" }
  ),
  delete: addProps(
    (addonItemId) => handleRequest(axiosInstance.delete(`/fnb/merchant/menu_addon_item/delete/${addonItemId}`)),
    { operationId: "fnb_merchant_menu_addon_item_delete" }
  ),
};

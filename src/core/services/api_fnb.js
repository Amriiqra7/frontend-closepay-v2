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
  find: addProps(
    (params) =>
      handleRequest(
        axiosInstance.get("/fnb/merchant/menu_category/find", {
          params: removeEmptyParams(params),
        })
      ),
    { operationId: "merchant_menu_category_find" }
  ),
  getById: addProps(
    (categoryId) => handleRequest(axiosInstance.get(`/fnb/merchant/menu_category/get/${categoryId}`)),
    { operationId: "merchant_menu_category_get" }
  ),
  create: addProps(
    (payload) => handleRequest(axiosInstance.post("/fnb/merchant/menu_category/create", payload)),
    { operationId: "merchant_menu_category_create" }
  ),
  update: addProps(
    (categoryId, payload) =>
      handleRequest(axiosInstance.put(`/fnb/merchant/menu_category/update/${categoryId}`, payload)),
    { operationId: "merchant_menu_category_update" }
  ),
  delete: addProps(
    (categoryId) => handleRequest(axiosInstance.delete(`/fnb/merchant/menu_category/delete/${categoryId}`)),
    { operationId: "merchant_menu_category_delete" }
  ),
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
  bulkCreate: addProps(
    (payload) => handleRequest(axiosInstance.post("/fnb/merchant/menu_addon_group_map/bulk_create", payload)),
    { operationId: "fnb_merchant_menu_addon_group_map_bulk_create" }
  ),
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

export const fnbMerchantKiosk = {
  find: addProps(
    (params) =>
      handleRequest(
        axiosInstance.get("/fnb/merchant/kiosk/find", {
          params: removeEmptyParams(params),
        })
      ),
    { operationId: "merchant_kiosk_find" }
  ),
  getById: addProps(
    (kioskId) => handleRequest(axiosInstance.get(`/fnb/merchant/kiosk/get/${kioskId}`)),
    { operationId: "merchant_kiosk_get" }
  ),
  create: addProps(
    (payload) => handleRequest(axiosInstance.post("/fnb/merchant/kiosk/create", payload)),
    { operationId: "merchant_kiosk_create" }
  ),
  update: addProps(
    (kioskId, payload) => handleRequest(axiosInstance.put(`/fnb/merchant/kiosk/update/${kioskId}`, payload)),
    { operationId: "merchant_kiosk_update" }
  ),
  rotateApiKey: addProps(
    (kioskId) => handleRequest(axiosInstance.put(`/fnb/merchant/kiosk/rotate_api_key/${kioskId}`)),
    { operationId: "merchant_kiosk_rotate_api_key" }
  ),
  activate: addProps(
    (kioskId) => handleRequest(axiosInstance.patch(`/fnb/merchant/kiosk/activate/${kioskId}`)),
    { operationId: "merchant_kiosk_activate" }
  ),
  revoke: addProps(
    (kioskId) => handleRequest(axiosInstance.patch(`/fnb/merchant/kiosk/revoke/${kioskId}`)),
    { operationId: "merchant_kiosk_revoke" }
  ),
};

export const fnbInternalUser = {
  find: addProps(
    (params) =>
      handleRequest(
        axiosInstance.get("/fnb/merchant/internal_user/find", {
          params: removeEmptyParams(params),
        })
      ),
    { operationId: "merchant_internal_user_find" }
  ),
  getById: addProps(
    (userId) => handleRequest(axiosInstance.get(`/fnb/merchant/internal_user/get/${userId}`)),
    { operationId: "merchant_internal_user_get" }
  ),
  create: addProps(
    (payload) => handleRequest(axiosInstance.post("/fnb/merchant/internal_user/create", payload)),
    { operationId: "merchant_internal_user_create" }
  ),
  update: addProps(
    (userId, payload) => handleRequest(axiosInstance.put(`/fnb/merchant/internal_user/update/${userId}`, payload)),
    { operationId: "merchant_internal_user_update" }
  ),
  delete: addProps(
    (userId) => handleRequest(axiosInstance.delete(`/fnb/merchant/internal_user/delete/${userId}`)),
    { operationId: "merchant_internal_user_delete" }
  ),
};

export const fnbMerchantQrCode = {
  generate: addProps(
    (payload = {}) => handleRequest(axiosInstance.post("/fnb/merchant/qr_code/generate", payload)),
    { operationId: "merchant_qr_code_generate" }
  ),
};

export const fnbMerchantTable = {
  find: addProps(
    (params = {}) =>
      handleRequest(
        axiosInstance.get("/fnb/merchant/table/find", {
          params: removeEmptyParams(params),
        })
      ),
    { operationId: "merchant_table_find" }
  ),
  getById: addProps(
    (tableId) => handleRequest(axiosInstance.get(`/fnb/merchant/table/get/${tableId}`)),
    { operationId: "merchant_table_get" }
  ),
  generate: addProps(
    (payload) => handleRequest(axiosInstance.post("/fnb/merchant/table/generate", payload)),
    { operationId: "merchant_table_generate" }
  ),
  delete: addProps(
    (tableId) => handleRequest(axiosInstance.delete(`/fnb/merchant/table/delete/${tableId}`)),
    { operationId: "merchant_table_delete" }
  ),
};

export const fnbMerchantReceiptTemplate = {
  get: addProps(
    () => handleRequest(axiosInstance.get("/fnb/merchant/receipt_template/get")),
    { operationId: "merchant_receipt_template_get" }
  ),
  generateDefault: addProps(
    () => handleRequest(axiosInstance.post("/fnb/merchant/receipt_template/generate-default")),
    { operationId: "merchant_receipt_template_generate_default" }
  ),
  save: addProps(
    (payload) => handleRequest(axiosInstance.post("/fnb/merchant/receipt_template/save", payload)),
    { operationId: "merchant_receipt_template_save" }
  ),
  reorder: addProps(
    (payload) => handleRequest(axiosInstance.post("/fnb/merchant/receipt_template/reorder", payload)),
    { operationId: "merchant_receipt_template_reorder" }
  ),
  updateValue: addProps(
    (payload) => handleRequest(axiosInstance.patch("/fnb/merchant/receipt_template/value", payload)),
    { operationId: "merchant_receipt_template_update_value" }
  ),
  resetDefault: addProps(
    () => handleRequest(axiosInstance.post("/fnb/merchant/receipt_template/reset-default")),
    { operationId: "merchant_receipt_template_reset_default" }
  ),
};

export const fnbMerchantPaymentConfig = {
  get: addProps(
    () => handleRequest(axiosInstance.get("/fnb/merchant/payment_config/get")),
    { operationId: "merchant_payment_config_get" }
  ),
  update: addProps(
    (payload) => handleRequest(axiosInstance.put("/fnb/merchant/payment_config/update", payload)),
    { operationId: "merchant_payment_config_update" }
  ),
};

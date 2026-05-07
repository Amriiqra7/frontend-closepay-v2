"use client";

import React from "react";
import useSWR from "swr";
import { useFormik, FormikProvider, Form } from "formik";
import { useRouter } from "next/navigation";
import { Box, Button, Divider, Paper, Stack, Typography } from "@mui/material";
import { AddCircle } from "iconsax-react";
import GeneralInformationSection from "./GeneralInformationSection";
import VariantRowCard from "./VariantRowCard";
import { useAutosearch } from "@/shared/ui/Autosearch";
import {
  fnbMenu,
  fnbMenuAddonGroup,
  fnbMenuAddonGroupMap,
  fnbMenuAddonItem,
  fnbMenuCategory,
  fnbMenuVariant,
} from "@/core/services/api_fnb";
import { getApiErrorMessage, showErrorToast, toastPromise } from "@/shared/utils/toast";

const createVariantRow = (overrides = {}) => ({
  key: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
  _id: "",
  name: "",
  price: "",
  sku: "",
  isDefault: false,
  isAvailable: true,
  ...overrides,
});

const normalizeNumber = (value) => {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : 0;
};

export default function EditMenuVariationPage({ menuId }) {
  const router = useRouter();
  const [variantRows, setVariantRows] = React.useState([createVariantRow()]);
  const [variantSavingMap, setVariantSavingMap] = React.useState({});
  const [selectedAddonGroups, setSelectedAddonGroups] = React.useState([]);
  const selectedAddonGroupIds = React.useMemo(
    () => (selectedAddonGroups || []).map((item) => item?._id).filter(Boolean),
    [selectedAddonGroups]
  );
  const hasInitializedAddonGroupRef = React.useRef(false);

  const { data: categoryResponse } = useSWR("fnb-menu-categories-edit", () => fnbMenuCategory.combo({ size: 10 }));
  const addonGroupSearch = useAutosearch(
    (params) => fnbMenuAddonGroup.combo({ ...params }),
    "fnb-menu-addon-group-edit"
  );
  const { data: addonItemsResponse, isLoading: addonItemsLoading } = useSWR(
    selectedAddonGroupIds.length ? ["fnb-menu-addon-items-edit", selectedAddonGroupIds.join(",")] : null,
    async () => {
      const responses = await Promise.all(
        selectedAddonGroupIds.map((groupId) =>
          fnbMenuAddonItem.find({
            groupId,
            size: 100,
            page: 1,
            order: "desc",
          })
        )
      );
      return {
        data: {
          items: responses.flatMap((response) => response?.data?.items || []),
        },
      };
    },
    { revalidateOnFocus: false, shouldRetryOnError: false }
  );
  const categoryOptions = React.useMemo(
    () => (categoryResponse?.data || []).map((item) => ({ value: item._id, label: item.name })),
    [categoryResponse]
  );
  const addonGroupItems = React.useMemo(() => addonItemsResponse?.data?.items || [], [addonItemsResponse]);

  const { data: detailResponse, error: detailError, mutate: mutateDetail } = useSWR(
    menuId ? ["fnb-menu-detail-edit", menuId] : null,
    () => fnbMenu.getById(menuId)
  );
  const menuDetail = detailResponse?.data || {};

  const { data: variantResponse, mutate: mutateVariants } = useSWR(
    menuId && menuDetail?.useVariant ? ["fnb-menu-variants-edit", menuId] : null,
    () => fnbMenuVariant.find({ menuId, size: 100, page: 1, order: "desc" })
  );

  const { data: addonGroupMapResponse } = useSWR(
    menuId ? ["fnb-menu-addon-group-map-edit", menuId] : null,
    () => fnbMenuAddonGroupMap.findByMenu({ menuId })
  );

  const currentAddonGroupMapId = React.useMemo(() => {
    const mapItems =
      addonGroupMapResponse?.data?.items ||
      addonGroupMapResponse?.data ||
      addonGroupMapResponse?.items ||
      [];
    const list = Array.isArray(mapItems) ? mapItems : [mapItems];
    return list.map((item) => item?._id || item?.mapId).filter(Boolean);
  }, [addonGroupMapResponse]);

  React.useEffect(() => {
    if (hasInitializedAddonGroupRef.current) return;
    const mapItems =
      addonGroupMapResponse?.data?.items ||
      addonGroupMapResponse?.data ||
      addonGroupMapResponse?.items ||
      [];
    const list = (Array.isArray(mapItems) ? mapItems : [mapItems]).filter(Boolean);
    const nextSelected = list
      .map((item) => {
        const firstDetailGroup = Array.isArray(item?.detailAddonGroup) ? item.detailAddonGroup[0] : null;
        const rawGroup = firstDetailGroup?.addonGroup || item?.addonGroup || item?.group || null;
        const addonGroupId = item?.addonGroupId || rawGroup?._id || (typeof rawGroup === "string" ? rawGroup : "");
        if (!addonGroupId) return null;
        const fromOptions = (addonGroupSearch.options || []).find((opt) => opt?._id === addonGroupId);
        return fromOptions || { _id: addonGroupId, name: rawGroup?.name || item?.addonGroupName || "" };
      })
      .filter(Boolean);
    if (nextSelected.length === 0) return;
    setSelectedAddonGroups(nextSelected);
    hasInitializedAddonGroupRef.current = true;
  }, [addonGroupMapResponse, addonGroupSearch.options]);

  React.useEffect(() => {
    const rawRows = variantResponse?.data?.items || [];
    if (!Array.isArray(rawRows) || rawRows.length === 0) {
      setVariantRows([createVariantRow({ isDefault: true })]);
      return;
    }
    setVariantRows(
      rawRows.map((variant, index) =>
        createVariantRow({
          key: variant?._id || `variant-${index}`,
          _id: variant?._id || "",
          name: variant?.name || "",
          price: variant?.price ?? "",
          sku: variant?.sku || "",
          isDefault: Boolean(variant?.isDefault),
          isAvailable: Boolean(variant?.isAvailable),
        })
      )
    );
  }, [variantResponse]);

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      _id: menuDetail?._id || menuId || "",
      name: menuDetail?.name || "",
      description: menuDetail?.description || "",
      categoryId: menuDetail?.categoryId || "",
      useVariant: Boolean(menuDetail?.useVariant),
      basePrice: menuDetail?.basePrice ?? "",
      minVariantPrice: menuDetail?.minVariantPrice ?? "",
      imageUrl: menuDetail?.imageUrl || "",
      isAvailable: menuDetail?.isAvailable ?? true,
      isActive: menuDetail?.isActive ?? true,
    },
    onSubmit: async (values) => {
      const payload = {
        name: values.name,
        description: values.description,
        categoryId: values.categoryId,
        useVariant: values.useVariant,
        basePrice: values.useVariant ? null : Number(values.basePrice || 0),
        minVariantPrice: values.useVariant ? Number(values.minVariantPrice || 0) : Number(values.basePrice || 0),
        imageUrl: values.imageUrl || "",
        isAvailable: values.isAvailable,
        isActive: values.isActive,
      };

      const pendingNewVariants = variantRows.filter(
        (row) =>
          !row._id &&
          String(row.name || "").trim() &&
          String(row.price ?? "").trim() &&
          String(row.sku || "").trim()
      );

      const submitPromise = (async () => {
        await fnbMenu.update(values._id, payload);
        if (values.useVariant && pendingNewVariants.length > 0) {
          await fnbMenuVariant.create(
            pendingNewVariants.map((row) => ({
              menuId,
              name: row.name.trim(),
              price: normalizeNumber(row.price),
              sku: row.sku || "",
              isDefault: Boolean(row.isDefault),
              isAvailable: Boolean(row.isAvailable),
            }))
          );
        }

        if (selectedAddonGroupIds.length > 0) {
          for (const mapId of currentAddonGroupMapId) {
            await fnbMenuAddonGroupMap.delete(mapId);
          }
          await fnbMenuAddonGroupMap.bulkCreate({
            menuId,
            addonGroupIds: selectedAddonGroupIds,
          });
        }
      })();

      await toastPromise(submitPromise, {
        loading: "Menyimpan menu...",
        success: "Menu berhasil diperbarui.",
        error: (error) => getApiErrorMessage(error, "Gagal menyimpan menu."),
      });
      await mutateDetail();
      await mutateVariants();
      router.push("/fnb/master-product/menu-variations");
    },
  });

  React.useEffect(() => {
    if (detailError) {
      showErrorToast(getApiErrorMessage(detailError, "Gagal memuat detail menu."));
    }
  }, [detailError]);

  React.useEffect(() => {
    if (addonGroupSearch.error) {
      showErrorToast(getApiErrorMessage(addonGroupSearch.error, "Gagal memuat add on group."));
    }
  }, [addonGroupSearch.error]);

  const handleChangeVariant = React.useCallback((key, field, value) => {
    setVariantRows((prev) => prev.map((row) => (row.key === key ? { ...row, [field]: value } : row)));
  }, []);

  const handleRemoveVariant = React.useCallback(
    async (key) => {
      const target = variantRows.find((row) => row.key === key);
      if (!target) return;

      const execute = async () => {
        if (target._id) {
          await fnbMenuVariant.delete(target._id);
          await mutateVariants();
        } else {
          setVariantRows((prev) => prev.filter((row) => row.key !== key));
        }
      };

      await toastPromise(execute(), {
        loading: `Menghapus variant "${target.name || "Variant"}"...`,
        success: `Variant "${target.name || "Variant"}" berhasil dihapus.`,
        error: (error) => getApiErrorMessage(error, "Gagal menghapus variant."),
      });
    },
    [variantRows, mutateVariants]
  );

  const handleSaveVariant = React.useCallback(
    async (key) => {
      const target = variantRows.find((row) => row.key === key);
      if (!target || !target.name?.trim() || !String(target.price ?? "").trim() || !target.sku?.trim()) return;

      const payload = {
        menuId,
        name: target.name.trim(),
        price: normalizeNumber(target.price),
        sku: target.sku || "",
        isDefault: Boolean(target.isDefault),
        isAvailable: Boolean(target.isAvailable),
      };

      setVariantSavingMap((prev) => ({ ...prev, [key]: true }));
      try {
        if (target._id) {
          await toastPromise(fnbMenuVariant.update(target._id, payload), {
            loading: `Menyimpan variant "${target.name}"...`,
            success: `Variant "${target.name}" berhasil diperbarui.`,
            error: (error) => getApiErrorMessage(error, "Gagal menyimpan variant."),
          });
        } else {
          await toastPromise(fnbMenuVariant.create([payload]), {
            loading: `Membuat variant "${target.name}"...`,
            success: `Variant "${target.name}" berhasil dibuat.`,
            error: (error) => getApiErrorMessage(error, "Gagal membuat variant."),
          });
        }
        await mutateVariants();
      } finally {
        setVariantSavingMap((prev) => ({ ...prev, [key]: false }));
      }
    },
    [variantRows, menuId, mutateVariants]
  );

  return (
    <FormikProvider value={formik}>
      <Form>
        <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
          <Paper elevation={0} sx={{ borderRadius: 3, border: "1px solid #e8edf3", overflow: "hidden" }}>
            <GeneralInformationSection
              menuName={formik.values.name}
              category={formik.values.categoryId}
              basePrice={formik.values.basePrice}
              minVariantPrice={formik.values.minVariantPrice}
              statusChecked={formik.values.isAvailable}
              useVariant={formik.values.useVariant}
              description={formik.values.description}
              categoryOptions={categoryOptions}
              imagePreview={formik.values.imageUrl || ""}
              imageUrl={formik.values.imageUrl}
              onMenuNameChange={(event) => formik.setFieldValue("name", event.target.value)}
              onCategoryChange={(event) => formik.setFieldValue("categoryId", event.target.value)}
              onBasePriceChange={(value) => formik.setFieldValue("basePrice", value)}
              onMinVariantPriceChange={(value) => formik.setFieldValue("minVariantPrice", value)}
              onImageUrlChange={(event) => formik.setFieldValue("imageUrl", event.target.value)}
              onStatusChange={(event) => formik.setFieldValue("isAvailable", event.target.checked)}
              onUseVariantChange={(event) => {
                const checked = event.target.checked;
                formik.setFieldValue("useVariant", checked);
                if (checked && variantRows.length === 0) {
                  setVariantRows([createVariantRow({ isDefault: true })]);
                }
              }}
              onDescriptionChange={(event) => formik.setFieldValue("description", event.target.value)}
              addonGroups={selectedAddonGroups}
              addonGroupOptions={addonGroupSearch.options}
              addonGroupLoading={addonGroupSearch.loading}
              addonGroupOpen={addonGroupSearch.open}
              onAddonGroupOpen={addonGroupSearch.onOpen}
              onAddonGroupClose={addonGroupSearch.onClose}
              onAddonGroupInputChange={addonGroupSearch.onInputChange}
              onAddonGroupChange={(_, value) => setSelectedAddonGroups(value || [])}
              addonGroupItems={addonGroupItems}
              addonGroupItemsLoading={addonItemsLoading}
            />

            {formik.values.useVariant ? (
              <Box sx={{ px: { xs: 2.25, md: 2.5 }, pb: 2.25 }}>
                <Typography sx={{ color: "#0f172a", fontWeight: 800, mb: 1.5 }}>Variants</Typography>
                <Stack spacing={1.5}>
                  {variantRows.map((row, index) => (
                    <VariantRowCard
                      key={row.key}
                      row={row}
                      index={index}
                      canSave
                      isSaving={Boolean(variantSavingMap[row.key])}
                      canRemove={variantRows.length > 1}
                      onChange={handleChangeVariant}
                      onSave={handleSaveVariant}
                      onRemove={handleRemoveVariant}
                    />
                  ))}
                </Stack>
                <Box sx={{ mt: 1.5 }}>
                  <Button
                    variant="outlined"
                    startIcon={<AddCircle size={16} color="#155DFC" variant="Bold" />}
                    onClick={() => setVariantRows((prev) => [...prev, createVariantRow()])}
                    sx={{ textTransform: "none" }}
                  >
                    Add Variant
                  </Button>
                </Box>
              </Box>
            ) : null}

            <Divider />
            <Box sx={{ p: 2, display: "flex", justifyContent: "flex-end", gap: 1.25 }}>
              <Button type="button" variant="outlined" onClick={() => router.push("/fnb/master-product/menu-variations")}>
                Cancel
              </Button>
              <Button type="submit" variant="contained" disabled={formik.isSubmitting}>
                {formik.isSubmitting ? "Saving..." : "Save"}
              </Button>
            </Box>
          </Paper>
        </Box>
      </Form>
    </FormikProvider>
  );
}

"use client";

import React from "react";
import useSWR from "swr";
import { useFormik, FormikProvider, Form } from "formik";
import { useRouter } from "next/navigation";
import {
  Box,
  Button,
  Divider,
  Paper,
  Stack,
  Typography,
} from "@mui/material";
import { AddCircle } from "iconsax-react";
import { useAutosearch } from "@/shared/ui/Autosearch";
import {
  fnbMenu,
  fnbMenuAddonGroup,
  fnbMenuAddonGroupMap,
  fnbMenuAddonItem,
  fnbMenuCategory,
  fnbMenuVariant,
} from "@/core/services/api_fnb";
import { showErrorToast, toastPromise } from "@/shared/utils/toast";
import GeneralInformationSection from "./GeneralInformationSection";
import VariantRowCard from "./VariantRowCard";

const createVariantRow = (overrides = {}) => ({
  key: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
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

const extractMenuId = (response) =>
  typeof response?.data === "string"
    ? response.data
    : response?.data?.data && typeof response.data.data === "string"
      ? response.data.data
      : response?.data?._id ||
      response?.data?.menuId ||
      response?.data?.data?._id ||
      response?.data?.data?.menuId ||
      response?._id ||
      response?.menuId ||
      "";

export default function NewMenuVariationPage() {
  const router = useRouter();
  const [selectedAddonGroups, setSelectedAddonGroups] = React.useState([]);
  const [variantRows, setVariantRows] = React.useState([createVariantRow({ isDefault: true })]);
  const hasInitializedCategoryRef = React.useRef(false);
  const selectedAddonGroupIds = React.useMemo(
    () => (selectedAddonGroups || []).map((item) => item?._id).filter(Boolean),
    [selectedAddonGroups]
  );
  const { data: categoryResponse, error: categoryError } = useSWR(
    "fnb-menu-categories-new-page",
    () => fnbMenuCategory.combo({ size: 10 })
  );
  const addonGroupSearch = useAutosearch(
    (params) => fnbMenuAddonGroup.combo({ ...params }),
    "fnb-menu-addon-group-new"
  );
  const { data: addonItemsResponse, isLoading: addonItemsLoading } = useSWR(
    selectedAddonGroupIds.length ? ["fnb-menu-addon-items-new", selectedAddonGroupIds.join(",")] : null,
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
  const addonGroupItems = React.useMemo(() => addonItemsResponse?.data?.items || [], [addonItemsResponse]);

  const categoryOptions = React.useMemo(
    () =>
      (categoryResponse?.data || []).map((item) => ({
        label: item.name,
        value: item._id,
      })),
    [categoryResponse]
  );

  const formik = useFormik({
    enableReinitialize: false,
    initialValues: {
      name: "",
      description: "",
      categoryId: "",
      useVariant: false,
      basePrice: "",
      minVariantPrice: "",
      imageUrl: "",
      isAvailable: true,
      isActive: true,
    },
    onSubmit: async (values) => {
      const submitPromise = (async () => {
        const menuPayload = {
          name: values.name,
          description: values.description,
          categoryId: values.categoryId,
          useVariant: values.useVariant,
          basePrice: values.useVariant ? null : normalizeNumber(values.basePrice),
          minVariantPrice: values.useVariant
            ? normalizeNumber(values.minVariantPrice)
            : normalizeNumber(values.basePrice),
          imageUrl: values.imageUrl,
          isAvailable: values.isAvailable,
          isActive: values.isActive,
        };

        const createdMenu = await fnbMenu.create(menuPayload);
        const menuId = extractMenuId(createdMenu);
        if (!menuId) {
          throw new Error("Menu ID tidak ditemukan dari response create menu.");
        }

        if (values.useVariant && menuId) {
          const validVariants = (variantRows || []).filter(
            (variant) =>
              String(variant?.name || "").trim() &&
              String(variant?.price ?? "").trim() &&
              String(variant?.sku || "").trim()
          );

          if (validVariants.length === 0) {
            throw new Error("Variant aktif, tapi data variant belum diisi.");
          }

          await fnbMenuVariant.create(
            validVariants.map((variant) => ({
              menuId,
              name: variant.name,
              price: normalizeNumber(variant.price),
              sku: variant.sku || "",
              isDefault: Boolean(variant.isDefault),
              isAvailable: Boolean(variant.isAvailable),
            }))
          );
        }

        if (menuId && selectedAddonGroupIds.length > 0) {
          await fnbMenuAddonGroupMap.bulkCreate({
            menuId,
            addonGroupIds: selectedAddonGroupIds,
          });
        }
      })();

      await toastPromise(submitPromise, {
        loading: "Menyimpan menu...",
        success: "Menu berhasil disimpan.",
        error: (error) => error?.response?.data?.message || "Gagal menyimpan menu.",
      });

      router.push("/fnb/master-product/menu-variations");
    },
  });

  React.useEffect(() => {
    if (categoryError) {
      showErrorToast(categoryError?.response?.data?.message || "Gagal memuat kategori menu.");
    }
  }, [categoryError]);

  React.useEffect(() => {
    if (addonGroupSearch.error) {
      showErrorToast(addonGroupSearch.error?.response?.data?.message || "Gagal memuat add on group.");
    }
  }, [addonGroupSearch.error]);

  const categoryId = formik.values.categoryId;
  const setFieldValue = formik.setFieldValue;
  React.useEffect(() => {
    if (hasInitializedCategoryRef.current) return;
    if (!categoryId && categoryOptions.length > 0) {
      setFieldValue("categoryId", categoryOptions[0].value, false);
      hasInitializedCategoryRef.current = true;
    }
  }, [categoryId, categoryOptions, setFieldValue]);

  return (
    <FormikProvider value={formik}>
      <Form>
        <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
          <Paper
            sx={{
              border: "1px solid #e8edf3",
              overflow: "hidden",
              boxShadow: "0 20px 45px rgba(15, 23, 42, 0.05)",
              p: 2,
            }}
          >
            <Box sx={{ display: "flex", flexDirection: "column", gap: 2.25 }}>
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
            </Box>

            {formik.values.useVariant ? (
              <>
                <Divider />
                <Box sx={{ p: { xs: 2.25, md: 2.5 } }}>
                  <Typography sx={{ color: "#0f172a", fontWeight: 800, mb: 2 }}>Variant</Typography>

                  <Stack spacing={1.5}>
                    {variantRows.map((variant, index) => (
                      <VariantRowCard
                        key={variant.key}
                        row={variant}
                        index={index}
                        canRemove={variantRows.length > 1}
                        onRemove={(key) => setVariantRows((prev) => prev.filter((row) => row.key !== key))}
                        onChange={(key, field, value) =>
                          setVariantRows((prev) =>
                            prev.map((row) => (row.key === key ? { ...row, [field]: value } : row))
                          )
                        }
                      />
                    ))}
                  </Stack>
                  <Box sx={{ mt: 1.5, display: "flex", justifyContent: "flex-start" }}>
                    <Button
                      variant="outlined"
                      startIcon={<AddCircle size={16} color="#155DFC" variant="Bold" />}
                      onClick={() => setVariantRows((prev) => [...prev, createVariantRow({ isDefault: false })])}
                      sx={{ textTransform: "none" }}
                    >
                      Add Variant
                    </Button>
                  </Box>
                </Box>
              </>
            ) : null}

            <Divider />

            <Box sx={{ p: { xs: 2.25, md: 2.5 }, display: "flex", gap: 1.5, justifyContent: "flex-end" }}>
              <Button type="button" variant="outlined" onClick={() => router.push("/fnb/master-product/menu-variations")}>
                Cancel
              </Button>
              <Button
                type="submit"
                variant="contained"
                disabled={formik.isSubmitting || !formik.values.name || !formik.values.categoryId || !formik.values.description}
              >
                {formik.isSubmitting ? "Saving..." : "Save Menu"}
              </Button>
            </Box>
          </Paper>
        </Box>
      </Form>
    </FormikProvider>
  );
}

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
  Switch,
  TextField,
  Typography,
} from "@mui/material";
import { fnbMenu, fnbMenuCategory, fnbMenuVariant } from "@/core/services/api_fnb";
import { showErrorToast, toastPromise } from "@/shared/utils/toast";
import GeneralInformationSection from "./GeneralInformationSection";
import { formatRupiah, parseRupiah } from "@/shared/utils/format";

const requiredMarkSx = { color: "#dc2626" };
const variantToggleSx = (checked) => ({
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  px: 1.25,
  py: 0.85,
  borderRadius: 1.8,
  bgcolor: checked ? "rgba(21, 93, 252, 0.07)" : "#f8fafc",
  border: "1px solid",
  borderColor: checked ? "rgba(21, 93, 252, 0.2)" : "#e5e7eb",
  minHeight: 40,
  transition: "all .18s ease",
});

const variantToggleTextSx = (checked) => ({
  color: checked ? "#155DFC" : "#6b7280",
  fontSize: "0.78rem",
  fontWeight: 700,
  letterSpacing: "0.01em",
});

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

const apiFetcher = (request) => request;
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

function fileToDataUrl(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

export default function NewMenuVariationPage() {
  const router = useRouter();
  const [imagePreview, setImagePreview] = React.useState("");
  const { data: categoryResponse, error: categoryError } = useSWR(
    "fnb-menu-categories-new-page",
    () => apiFetcher(fnbMenuCategory.combo({ size: 10 }))
  );

  const categoryOptions = React.useMemo(
    () =>
      (categoryResponse?.data || []).map((item) => ({
        label: item.name,
        value: item._id,
      })),
    [categoryResponse]
  );

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      name: "",
      description: "",
      categoryId: categoryOptions[0]?.value || "",
      useVariant: false,
      basePrice: "",
      minVariantPrice: "",
      imageUrl: "",
      isAvailable: true,
      isActive: true,
      variants: [createVariantRow({ isDefault: true })],
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
          const variant = values.variants?.[0];
          if (!variant || !String(variant.name || "").trim()) {
            throw new Error("Variant aktif, tapi data variant belum diisi.");
          }
          if (!String(variant.price ?? "").trim()) {
            throw new Error("Variant aktif, tapi harga variant belum diisi.");
          }

          await fnbMenuVariant.create({
            menuId,
            name: variant.name,
            price: normalizeNumber(variant.price),
            sku: variant.sku || "",
            isDefault: Boolean(variant.isDefault),
            isAvailable: Boolean(variant.isAvailable),
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
    if (!formik.values.categoryId && categoryOptions.length > 0) {
      formik.setFieldValue("categoryId", categoryOptions[0].value);
    }
  }, [categoryOptions, formik]);

  React.useEffect(() => {
    setImagePreview(formik.values.imageUrl || "");
  }, [formik.values.imageUrl]);

  const handlePickImage = async (file) => {
    if (!file) return;
    const dataUrl = await fileToDataUrl(file);
    setImagePreview(dataUrl);
    formik.setFieldValue("imageUrl", dataUrl);
  };

  return (
    <FormikProvider value={formik}>
      <Form>
        <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
          <Paper
            sx={{
              borderRadius: 3,
              border: "1px solid #e8edf3",
              overflow: "hidden",
              boxShadow: "0 20px 45px rgba(15, 23, 42, 0.05)",
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
                imagePreview={imagePreview}
                onPickImage={handlePickImage}
                onMenuNameChange={(event) => formik.setFieldValue("name", event.target.value)}
                onCategoryChange={(event) => formik.setFieldValue("categoryId", event.target.value)}
                onBasePriceChange={(value) => formik.setFieldValue("basePrice", value)}
                onMinVariantPriceChange={(value) => formik.setFieldValue("minVariantPrice", value)}
                onStatusChange={(event) => formik.setFieldValue("isAvailable", event.target.checked)}
                onUseVariantChange={(event) => {
                  const checked = event.target.checked;
                  formik.setFieldValue("useVariant", checked);
                  if (checked && formik.values.variants.length === 0) {
                    formik.setFieldValue("variants", [createVariantRow({ isDefault: true })]);
                  }
                }}
                onDescriptionChange={(event) => formik.setFieldValue("description", event.target.value)}
              />
            </Box>

            {formik.values.useVariant ? (
              <>
                <Divider />
                <Box sx={{ p: { xs: 2.25, md: 2.5 } }}>
                  <Typography sx={{ color: "#0f172a", fontWeight: 800, mb: 2 }}>Variant</Typography>
                  {(() => {
                    const variant = formik.values.variants[0] || createVariantRow({ isDefault: true });
                    return (
                      <Paper elevation={0} sx={{ p: 1.5, borderRadius: 2, border: "1px solid #e8edf3" }}>
                        <Stack spacing={1.5}>
                          <Box
                            sx={{
                              display: "grid",
                              gridTemplateColumns: { xs: "1fr", md: "repeat(2, minmax(0, 1fr))" },
                              gap: 2,
                            }}
                          >
                            <Box>
                              <Typography sx={{ mb: 0.5, fontSize: "0.82rem", color: "#111827", fontWeight: 600 }}>
                                Name <Box component="span" sx={requiredMarkSx}>*</Box>
                              </Typography>
                              <TextField
                                size="small"
                                fullWidth
                                required
                                placeholder="Variant name"
                                value={variant.name}
                                onChange={(event) => formik.setFieldValue("variants", [{ ...variant, name: event.target.value }])}
                              />
                            </Box>
                            <Box>
                              <Typography sx={{ mb: 0.5, fontSize: "0.82rem", color: "#111827", fontWeight: 600 }}>
                                SKU
                              </Typography>
                              <TextField
                                size="small"
                                fullWidth
                                placeholder="Variant SKU"
                                value={variant.sku}
                                onChange={(event) => formik.setFieldValue("variants", [{ ...variant, sku: event.target.value }])}
                              />
                            </Box>
                            <Box>
                              <Typography sx={{ mb: 0.5, fontSize: "0.82rem", color: "#111827", fontWeight: 600 }}>
                                Price <Box component="span" sx={requiredMarkSx}>*</Box>
                              </Typography>
                              <TextField
                                type="text"
                                inputMode="numeric"
                                size="small"
                                fullWidth
                                required
                                placeholder="0"
                                value={formatRupiah(variant.price)}
                                onChange={(event) => formik.setFieldValue("variants", [{ ...variant, price: parseRupiah(event.target.value) }])}
                              />
                            </Box>
                            <Box sx={{ pt: 0.25 }}>
                              <Typography sx={{ mb: 0.5, fontSize: "0.82rem", color: "#111827", fontWeight: 600 }}>
                                Default
                              </Typography>
                              <Box sx={variantToggleSx(variant.isDefault)}>
                                <Typography sx={variantToggleTextSx(variant.isDefault)}>
                                  {variant.isDefault ? "Aktif" : "Nonaktif"}
                                </Typography>
                                <Switch
                                  checked={variant.isDefault}
                                  onChange={(event) =>
                                    formik.setFieldValue("variants", [{ ...variant, isDefault: event.target.checked }])
                                  }
                                  size="small"
                                  sx={{
                                    "& .MuiSwitch-switchBase.Mui-checked": { color: "#155DFC" },
                                    "& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track": {
                                      bgcolor: "#155DFC",
                                      opacity: 1,
                                    },
                                  }}
                                />
                              </Box>
                            </Box>
                            <Box sx={{ pt: 0.25 }}>
                              <Typography sx={{ mb: 0.5, fontSize: "0.82rem", color: "#111827", fontWeight: 600 }}>
                                Available
                              </Typography>
                              <Box sx={variantToggleSx(variant.isAvailable)}>
                                <Typography sx={variantToggleTextSx(variant.isAvailable)}>
                                  {variant.isAvailable ? "Aktif" : "Nonaktif"}
                                </Typography>
                                <Switch
                                  checked={variant.isAvailable}
                                  onChange={(event) =>
                                    formik.setFieldValue("variants", [{ ...variant, isAvailable: event.target.checked }])
                                  }
                                  size="small"
                                  sx={{
                                    "& .MuiSwitch-switchBase.Mui-checked": { color: "#155DFC" },
                                    "& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track": {
                                      bgcolor: "#155DFC",
                                      opacity: 1,
                                    },
                                  }}
                                />
                              </Box>
                            </Box>
                          </Box>
                        </Stack>
                      </Paper>
                    );
                  })()}
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
                disabled={
                  formik.isSubmitting ||
                  !formik.values.name ||
                  !formik.values.categoryId ||
                  !formik.values.description
                }
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

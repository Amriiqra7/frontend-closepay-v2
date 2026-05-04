"use client";

import React from "react";
import useSWR from "swr";
import { useFormik, FormikProvider, Form } from "formik";
import { useRouter } from "next/navigation";
import { Box, Button, Divider, Paper, Typography } from "@mui/material";
import ProductDetailHeader from "./ProductDetailHeader";
import GeneralInformationSection from "./GeneralInformationSection";
import { fnbMenu, fnbMenuCategory, fnbMenuVariant } from "@/core/services/api_fnb";
import { showErrorToast, toastPromise } from "@/shared/utils/toast";
import { formatRupiah, parseRupiah } from "@/shared/utils/format";

const apiFetcher = (request) => request;

function fileToDataUrl(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

export default function EditMenuVariationPage({ menuId }) {
  const router = useRouter();
  const [imagePreview, setImagePreview] = React.useState("");

  const { data: categoryResponse } = useSWR("fnb-menu-categories-edit", () =>
    apiFetcher(fnbMenuCategory.combo({ size: 10 }))
  );
  const categoryOptions = React.useMemo(
    () => (categoryResponse?.data || []).map((item) => ({ value: item._id, label: item.name })),
    [categoryResponse]
  );

  const { data: detailResponse, error: detailError, mutate: mutateDetail } = useSWR(
    menuId ? ["fnb-menu-detail-edit", menuId] : null,
    () => apiFetcher(fnbMenu.getById(menuId))
  );
  const menuDetail = detailResponse?.data || {};

  const { data: variantResponse } = useSWR(
    menuId && menuDetail?.useVariant ? ["fnb-menu-variants-edit", menuId] : null,
    () => apiFetcher(fnbMenuVariant.find({ menuId, size: 10, page: 1, order: "asc" }))
  );
  const variants = variantResponse?.data?.items || [];
  const firstVariant = variants[0] || null;

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
      variantId: "",
      variantName: "",
      variantPrice: "",
      variantSku: "",
      variantIsDefault: true,
      variantIsAvailable: true,
    },
    onSubmit: async (values) => {
      const payload = {
        name: values.name,
        description: values.description,
        categoryId: values.categoryId,
        useVariant: values.useVariant,
        basePrice: values.useVariant ? null : Number(values.basePrice || 0),
        minVariantPrice: values.useVariant
          ? Number(values.minVariantPrice || 0)
          : Number(values.basePrice || 0),
        imageUrl: values.imageUrl || "",
        isAvailable: values.isAvailable,
        isActive: values.isActive,
      };

      const submitPromise = (async () => {
        await fnbMenu.update(values._id, payload);

        if (values.useVariant) {
          const variantPayload = {
            menuId: values._id,
            name: values.variantName,
            price: Number(values.variantPrice || 0),
            sku: values.variantSku || "",
            isDefault: Boolean(values.variantIsDefault),
            isAvailable: Boolean(values.variantIsAvailable),
          };

          if (values.variantId) {
            await fnbMenuVariant.update(values.variantId, variantPayload);
          } else {
            await fnbMenuVariant.create(variantPayload);
          }
        }
      })();

      await toastPromise(submitPromise, {
        loading: "Menyimpan menu...",
        success: "Menu berhasil diperbarui.",
        error: (error) => error?.response?.data?.message || "Gagal menyimpan menu.",
      });
      await mutateDetail();
      router.push("/fnb/master-product/menu-variations");
    },
  });

  React.useEffect(() => {
    if (detailError) {
      showErrorToast(detailError?.response?.data?.message || "Gagal memuat detail menu.");
    }
  }, [detailError]);

  React.useEffect(() => {
    setImagePreview(formik.values.imageUrl || "");
  }, [formik.values.imageUrl]);

  React.useEffect(() => {
    if (!firstVariant) return;
    formik.setFieldValue("variantId", firstVariant._id || "");
    formik.setFieldValue("variantName", firstVariant.name || "");
    formik.setFieldValue("variantPrice", firstVariant.price ?? "");
    formik.setFieldValue("variantSku", firstVariant.sku || "");
    formik.setFieldValue("variantIsDefault", Boolean(firstVariant.isDefault));
    formik.setFieldValue("variantIsAvailable", Boolean(firstVariant.isAvailable));
  }, [firstVariant]);

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
          <Paper elevation={0} sx={{ borderRadius: 3, border: "1px solid #e8edf3", overflow: "hidden" }}>
            <ProductDetailHeader
              title={formik.values.name || "Edit Menu"}
              productId={formik.values._id || "-"}
              onPrimaryAction={formik.submitForm}
              primaryLabel={formik.isSubmitting ? "Saving..." : "Save"}
            />
            <Divider />

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
              onUseVariantChange={(event) => formik.setFieldValue("useVariant", event.target.checked)}
              onDescriptionChange={(event) => formik.setFieldValue("description", event.target.value)}
            />

            {formik.values.useVariant ? (
              <Box sx={{ px: { xs: 2.25, md: 2.5 }, pb: 2.25 }}>
                <Typography sx={{ color: "#0f172a", fontWeight: 800, mb: 1.25 }}>Variants</Typography>
                <Paper elevation={0} sx={{ p: 1.5, borderRadius: 2, border: "1px solid #e8edf3" }}>
                  <Box
                    sx={{
                      display: "grid",
                      gridTemplateColumns: { xs: "1fr", md: "repeat(2, minmax(0, 1fr))" },
                      gap: 2,
                    }}
                  >
                    <Box>
                      <Typography sx={{ mb: 0.5, fontSize: "0.82rem", color: "#111827", fontWeight: 600 }}>
                        Name
                      </Typography>
                      <input
                        value={formik.values.variantName}
                        onChange={(event) => formik.setFieldValue("variantName", event.target.value)}
                        style={{ width: "100%", height: 40, border: "1px solid #d1d5db", borderRadius: 8, padding: "0 12px" }}
                      />
                    </Box>
                    <Box>
                      <Typography sx={{ mb: 0.5, fontSize: "0.82rem", color: "#111827", fontWeight: 600 }}>
                        SKU
                      </Typography>
                      <input
                        value={formik.values.variantSku}
                        onChange={(event) => formik.setFieldValue("variantSku", event.target.value)}
                        style={{ width: "100%", height: 40, border: "1px solid #d1d5db", borderRadius: 8, padding: "0 12px" }}
                      />
                    </Box>
                    <Box>
                      <Typography sx={{ mb: 0.5, fontSize: "0.82rem", color: "#111827", fontWeight: 600 }}>
                        Price
                      </Typography>
                      <input
                        value={formatRupiah(formik.values.variantPrice)}
                        onChange={(event) => formik.setFieldValue("variantPrice", parseRupiah(event.target.value))}
                        style={{ width: "100%", height: 40, border: "1px solid #d1d5db", borderRadius: 8, padding: "0 12px" }}
                      />
                    </Box>
                  </Box>
                </Paper>
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

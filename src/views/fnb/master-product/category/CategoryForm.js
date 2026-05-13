"use client";

import React from "react";
import { useParams, useRouter } from "next/navigation";
import useSWR from "swr";
import { Form, FormikProvider, useFormik } from "formik";
import * as Yup from "yup";
import {
  Box,
  Button,
  Divider,
  Paper,
  Switch,
  TextField,
  Typography,
} from "@mui/material";
import TextareaAutosize from "@mui/material/TextareaAutosize";
import { fnbMenuCategory } from "@/core/services/api_fnb";
import { getApiErrorMessage, showErrorToast, toastPromise } from "@/shared/utils/toast";

const labelSx = {
  color: "#374151",
  fontSize: "0.875rem",
  fontWeight: 500,
};

const textareaSx = {
  width: "100%",
  borderRadius: "8px",
  border: "1px solid #d1d5db",
  fontFamily: "inherit",
  fontSize: "0.875rem",
  color: "#111827",
  padding: "10px 14px",
  lineHeight: 1.5,
  resize: "vertical",
  backgroundColor: "#fff",
  outline: "none",
};

export default function CategoryForm({ mode = "create", categoryId }) {
  const router = useRouter();
  const params = useParams();
  const isEdit = mode === "edit";
  const resolvedCategoryId = React.useMemo(
    () => categoryId || params?.categoryId || "",
    [categoryId, params?.categoryId]
  );

  const { data: detailResponse, error: detailError } = useSWR(
    isEdit && resolvedCategoryId ? ["fnb-category-detail-edit", resolvedCategoryId] : null,
    () => fnbMenuCategory.getById(resolvedCategoryId),
    { revalidateOnFocus: false, shouldRetryOnError: false }
  );

  React.useEffect(() => {
    if (detailError) {
      showErrorToast(getApiErrorMessage(detailError, "Gagal memuat detail kategori."));
    }
  }, [detailError]);

  const categoryDetail = detailResponse?.data || {};
  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      name: categoryDetail?.name || "",
      description: categoryDetail?.description || "",
      sortOrder: String(categoryDetail?.sortOrder ?? 1),
      isActive: typeof categoryDetail?.isActive === "boolean" ? categoryDetail.isActive : true,
    },
    validationSchema: Yup.object({
      name: Yup.string().trim().required("Nama kategori wajib diisi."),
      description: Yup.string().trim().required("Deskripsi wajib diisi."),
      sortOrder: Yup.number()
        .typeError("Sort order harus berupa angka.")
        .integer("Sort order harus angka bulat.")
        .min(0, "Sort order minimal 0.")
        .required("Sort order wajib diisi."),
      isActive: Yup.boolean().required(),
    }),
    onSubmit: async (values) => {
      const payload = {
        name: values.name.trim(),
        description: values.description.trim(),
        sortOrder: Number(values.sortOrder || 0),
        isActive: Boolean(values.isActive),
      };

      const submitPromise = isEdit
        ? fnbMenuCategory.update(resolvedCategoryId, payload)
        : fnbMenuCategory.create(payload);

      await toastPromise(submitPromise, {
        loading: isEdit ? "Menyimpan kategori..." : "Membuat kategori...",
        success: isEdit ? "Kategori berhasil diperbarui." : "Kategori berhasil dibuat.",
        error: (error) => getApiErrorMessage(error, isEdit ? "Gagal menyimpan kategori." : "Gagal membuat kategori."),
      });
      router.push("/fnb/master-product/category");
    },
  });

  const isDetailLoading = isEdit && !detailResponse && !detailError;

  return (
    <FormikProvider value={formik}>
      <Form>
        <Box sx={{ display: "grid", gridTemplateColumns: "1fr", gap: 2.5, alignItems: "start" }}>
          <Paper
            elevation={0}
            sx={{
              borderRadius: 3,
              border: "1px solid #e5e7eb",
              p: { xs: 2, md: 3 },
              bgcolor: "#fcfdff",
              boxShadow: "0 14px 32px rgba(15, 23, 42, 0.04)",
              mb: 2,
            }}
          >
            <Box sx={{ border: "1px solid #e6ebf2", borderRadius: 2.2, p: { xs: 1.5, md: 2 }, bgcolor: "#fff" }}>
              <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", md: "repeat(2, minmax(0, 1fr))" }, gap: 2, mb: 2 }}>
                <Box>
                  <Typography sx={{ ...labelSx, mb: 1 }}>Nama Kategori</Typography>
                  <TextField
                    fullWidth
                    required
                    size="small"
                    value={formik.values.name}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    name="name"
                    placeholder="Masukkan nama kategori"
                    error={Boolean(formik.touched.name && formik.errors.name)}
                    helperText={formik.touched.name && formik.errors.name ? formik.errors.name : " "}
                  />
                </Box>
                <Box>
                  <Typography sx={{ ...labelSx, mb: 1 }}>Sort Order</Typography>
                  <TextField
                    fullWidth
                    size="small"
                    type="number"
                    value={formik.values.sortOrder}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    name="sortOrder"
                    placeholder="1"
                    error={Boolean(formik.touched.sortOrder && formik.errors.sortOrder)}
                    helperText={formik.touched.sortOrder && formik.errors.sortOrder ? formik.errors.sortOrder : " "}
                  />
                </Box>
              </Box>

              <Typography sx={{ ...labelSx, mb: 1 }}>Deskripsi</Typography>
              <TextareaAutosize
                minRows={3}
                value={formik.values.description}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                name="description"
                placeholder="Masukkan deskripsi..."
                style={textareaSx}
              />
              {formik.touched.description && formik.errors.description ? (
                <Typography sx={{ color: "#d32f2f", fontSize: "0.75rem", mt: 0.5 }}>{formik.errors.description}</Typography>
              ) : null}

              <Box sx={{ mt: 2 }}>
                <Divider sx={{ mb: 2 }} />
              </Box>

              <Box>
                <Typography sx={{ ...labelSx, mb: 0.75 }}>Status</Typography>
                <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", border: "1px solid #e5e7eb", borderRadius: 2, px: 1.25, py: 0.5 }}>
                  <Typography sx={{ color: formik.values.isActive ? "#155DFC" : "#6b7280", fontWeight: 500, fontSize: "0.82rem" }}>
                    {formik.values.isActive ? "Aktif" : "Nonaktif"}
                  </Typography>
                  <Switch checked={formik.values.isActive} onChange={(e) => formik.setFieldValue("isActive", e.target.checked)} size="small" />
                </Box>
              </Box>
            </Box>

            <Divider sx={{ my: 2.5 }} />

            <Box sx={{ display: "flex", gap: 1.5, justifyContent: "flex-end" }}>
              <Button type="button" variant="outlined" onClick={() => router.push("/fnb/master-product/category")}>
                Cancel
              </Button>
              <Button type="submit" variant="contained" disabled={formik.isSubmitting || isDetailLoading}>
                {formik.isSubmitting ? "Saving..." : "Save"}
              </Button>
            </Box>
          </Paper>
        </Box>
      </Form>
    </FormikProvider>
  );
}

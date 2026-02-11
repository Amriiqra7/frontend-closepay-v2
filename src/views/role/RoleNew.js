"use client";

import {
  Button,
  CardActions,
  CardContent,
  Divider,
  Stack,
} from "@mui/material";
import LoadingButton from "@/components/LoadingButton";
import MainCard from "@/components/MainCard";
import { Form, FormikProvider, useFormik } from "formik";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect } from "react";
import RoleForm from "./RoleForm";
import { initialValues, validationSchema } from "./RoleValidation";

// Placeholder API - replace with actual API service
const RoleAPI = {
  create: async (values) => {
    // Simulate API call
    return new Promise((resolve) => {
      setTimeout(() => {
        console.log("Creating role:", values);
        resolve({ success: true });
      }, 1000);
    });
  },
};

// Mock companies untuk pre-fill
const mockCompanies = [
  { id: 1, nama: 'PT Bougenvile Blok' },
  { id: 2, nama: 'PT Kantin FKi 12' },
  { id: 3, nama: 'PT Perusahaan ABC' },
  { id: 4, nama: 'CV XYZ Indonesia' },
  { id: 5, nama: 'PT Global Tech Solutions' },
];

export default function RoleNew() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const companyId = searchParams?.get('companyId');

  const formik = useFormik({
    initialValues: {
      ...initialValues,
      // Pre-fill perusahaan jika ada companyId
      perusahaan: companyId 
        ? mockCompanies.find(c => c.id === parseInt(companyId)) || null
        : null,
    },
    validationSchema,
    onSubmit: async (values, { setSubmitting }) => {
      setSubmitting(true);
      try {
        // Transform values untuk API (convert object ke ID jika perlu)
        const apiValues = {
          ...values,
          perusahaanId: values.perusahaan?.id || null,
          userTipeId: values.userTipe?.id || null,
        };
        await RoleAPI.create(apiValues);
        // Show success message (you can add toast notification here)
        alert("Data peran hak akses berhasil disimpan");
        // Redirect kembali ke list dengan companyId jika ada
        if (companyId) {
          router.push(`/role/data-role/list?companyId=${companyId}`);
        } else {
          router.push(pathname.replace("/new", ""));
        }
      } catch (err) {
        // Show error message
        alert(`Gagal menyimpan data!\n${err.message}`);
      } finally {
        setSubmitting(false);
      }
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    formik.handleSubmit();

    if (!formik.isValid) {
      alert(
        "Pastikan semua data wajib telah diisi dengan lengkap dan benar!"
      );
      console.log("Errors:", formik.errors);
    }
  };

  return (
    <FormikProvider value={formik}>
      <Form autoComplete="off" noValidate onSubmit={handleSubmit}>
        <MainCard content={false}>
          <CardContent sx={{ border: "none" }}>
            <RoleForm />
          </CardContent>

          <Divider sx={{ mt: 2 }} />
          <CardActions>
            <Stack
              direction="row"
              alignItems="center"
              justifyContent="end"
              sx={{ width: 1 }}
            >
              <Stack direction="row" spacing={1} sx={{ px: 1.5, py: 0.75 }}>
                <Button
                  color="secondary"
                  variant="text"
                  size="medium"
                  onClick={() => {
                    router.back();
                  }}
                >
                  Batal
                </Button>
                <LoadingButton
                  type="submit"
                  variant="contained"
                  size="medium"
                  loading={formik.isSubmitting}
                >
                  Simpan
                </LoadingButton>
              </Stack>
            </Stack>
          </CardActions>
        </MainCard>
      </Form>
    </FormikProvider>
  );
}

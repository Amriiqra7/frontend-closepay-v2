"use client";

import {
  Button,
  CardActions,
  CardContent,
  Divider,
  Stack,
} from "@mui/material";
import LoadingButton from "@/shared/ui/LoadingButton";
import MainCard from "@/shared/ui/MainCard";
import { Form, FormikProvider, useFormik } from "formik";
import { usePathname, useRouter } from "next/navigation";
import DataIzinAksesForm from "./DataIzinAksesForm";
import { initialValues, validationSchema } from "./DataIzinAksesValidation";

// Placeholder API - replace with actual API service
const DataIzinAksesAPI = {
  create: async (values) => {
    // Simulate API call
    return new Promise((resolve) => {
      setTimeout(() => {
        console.log("Creating data izin akses:", values);
        resolve({ success: true });
      }, 1000);
    });
  },
};

export default function DataIzinAksesNew() {
  const router = useRouter();
  const pathname = usePathname();

  const formik = useFormik({
    initialValues,
    validationSchema,
    onSubmit: async (values, { setSubmitting }) => {
      setSubmitting(true);
      try {
        await DataIzinAksesAPI.create(values);
        // Show success message (you can add toast notification here)
        alert("Data izin akses berhasil disimpan");
        // Redirect kembali ke list
        router.push(pathname.replace("/new", ""));
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
            <DataIzinAksesForm />
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
                  color="error"
                  variant="outlined"
                  size="medium"
                  onClick={() => {
                    router.back();
                  }}
                  sx={{
                    textTransform: "none",
                  }}
                >
                  Batal
                </Button>
                <LoadingButton
                  type="submit"
                  variant="contained"
                  size="medium"
                  loading={formik.isSubmitting}
                  sx={{
                    textTransform: "none",
                  }}
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

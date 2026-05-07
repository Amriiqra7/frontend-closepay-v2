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
import CompanyForm from "./CompanyForm";
import { initialValues, validationSchema } from "./CompanyValidation";
import { handleCreateWithToast } from "@/shared/utils/toast";

// Placeholder API - replace with actual API service
const CompanyAPI = {
  create: async (values) => {
    // Simulate API call
    return new Promise((resolve) => {
      setTimeout(() => {
        console.log("Creating company:", values);
        resolve({ success: true });
      }, 1000);
    });
  },
};

export default function CompanyNew() {
  const router = useRouter();
  const pathname = usePathname();

  const formik = useFormik({
    initialValues,
    validationSchema,
    onSubmit: async (values, { setSubmitting }) => {
      setSubmitting(true);
      try {
        await handleCreateWithToast(
          CompanyAPI.create(values),
          'perusahaan'
        );
        router.push(pathname.replace("/new", ""));
      } catch (err) {
        // Error already handled by toast
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
            <CompanyForm />
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
                  Tambah
                </LoadingButton>
              </Stack>
            </Stack>
          </CardActions>
        </MainCard>
      </Form>
    </FormikProvider>
  );
}

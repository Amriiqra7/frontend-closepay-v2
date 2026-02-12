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
import { usePathname, useRouter, useParams } from "next/navigation";
import { useEffect, useState } from "react";
import DataIzinAksesForm from "./DataIzinAksesForm";
import { initialValues, validationSchema } from "./DataIzinAksesValidation";
import PageLoading from "@/shared/ui/PageLoading";

// Placeholder API - replace with actual API service
const DataIzinAksesAPI = {
  getById: async (id) => {
    // Simulate API call - replace with actual API
    return new Promise((resolve) => {
      setTimeout(() => {
        // Mock data - replace with actual API call
        const mockData = {
          id: parseInt(id),
          servis: 'user',
          userTipe: 'admin',
          grup: 'Membership',
          nama: 'Membersip Activate or Deactivate Admin',
          kode: 'user_membership_activate_deactivate_admin',
          deskripsi: 'Membersip Activate or Deactivate Admin (user_membership_activate_deactivate_admin)',
          status: 'aktif',
        };
        resolve(mockData);
      }, 500);
    });
  },
  update: async (id, values) => {
    // Simulate API call
    return new Promise((resolve) => {
      setTimeout(() => {
        console.log("Updating data izin akses:", id, values);
        resolve({ success: true });
      }, 1000);
    });
  },
};

export default function DataIzinAksesEdit() {
  const router = useRouter();
  const pathname = usePathname();
  const params = useParams();
  const dataIzinAksesId = params?.id;
  const [loading, setLoading] = useState(true);
  const [initialData, setInitialData] = useState(null);

  useEffect(() => {
    const fetchDataIzinAkses = async () => {
      if (!dataIzinAksesId) return;
      
      try {
        setLoading(true);
        const data = await DataIzinAksesAPI.getById(dataIzinAksesId);
        setInitialData(data);
      } catch (err) {
        console.error('Error fetching data izin akses:', err);
        alert('Gagal memuat data izin akses');
        router.back();
      } finally {
        setLoading(false);
      }
    };

    fetchDataIzinAkses();
  }, [dataIzinAksesId, router]);

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: initialData || initialValues,
    validationSchema,
    onSubmit: async (values, { setSubmitting }) => {
      setSubmitting(true);
      try {
        await DataIzinAksesAPI.update(dataIzinAksesId, values);
        // Show success message (you can add toast notification here)
        alert("Data izin akses berhasil diperbarui");
        // Redirect kembali ke list
        router.push(pathname.replace(`/${dataIzinAksesId}/edit`, ''));
      } catch (err) {
        // Show error message
        alert(`Gagal memperbarui data!\n${err.message}`);
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

  if (loading || !initialData) {
    return <PageLoading />;
  }

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

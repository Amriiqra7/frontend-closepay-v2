"use client";

import {
  Button,
  CardActions,
  CardContent,
  Divider,
  Stack,
  Typography,
} from "@mui/material";
import LoadingButton from "@/shared/ui/LoadingButton";
import MainCard from "@/shared/ui/MainCard";
import { Form, FormikProvider, useFormik } from "formik";
import { usePathname, useRouter, useParams } from "next/navigation";
import CompanyForm from "./CompanyForm";
import { initialValues, validationSchema } from "./CompanyValidation";
import { useEffect, useState } from "react";
import { handleUpdateWithToast, showErrorToast } from "@/shared/utils/toast";

// Placeholder API - replace with actual API service
const CompanyAPI = {
  getById: async (id) => {
    // Simulate API call - replace with actual API
    return new Promise((resolve) => {
      setTimeout(() => {
        // Mock data - replace with actual API call
        resolve({
          id: parseInt(id),
          logo: null,
          name: 'Bougenvile Blok',
          companyInitial: 'BB',
          address: 'Jl. Contoh Alamat No. 123',
          financialType: 'Outlet 23',
          billingAccount: 'Pandawa',
          picName: 'Arik Riko Prasetya',
          picEmail: 'ArikRikoPrasetya@gmail.com',
          picPhone: '081234567890',
          picUsername: 'arikriko',
          picPassword: 'password123',
          homepage: 'Dashboard',
          companyMenus: {
            'Dashboard': true,
            'Transaksi': true,
            'Laporan': false,
            'Pengaturan': true,
            'Manajemen': false,
            'Keuangan': true,
            'Pengguna': false,
          },
        });
      }, 500);
    });
  },
  update: async (id, values) => {
    // Simulate API call
    return new Promise((resolve) => {
      setTimeout(() => {
        console.log("Updating company:", id, values);
        resolve({ success: true });
      }, 1000);
    });
  },
};

export default function CompanyEdit() {
  const router = useRouter();
  const pathname = usePathname();
  const params = useParams();
  const companyId = params?.id;
  const [loading, setLoading] = useState(true);
  const [initialData, setInitialData] = useState(null);

  useEffect(() => {
    const fetchCompany = async () => {
      if (!companyId) return;
      
      try {
        setLoading(true);
        const data = await CompanyAPI.getById(companyId);
        setInitialData(data);
      } catch (err) {
        console.error('Error fetching company:', err);
        showErrorToast('Gagal memuat data perusahaan');
        router.back();
      } finally {
        setLoading(false);
      }
    };

    fetchCompany();
  }, [companyId, router]);

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: initialData || initialValues,
    validationSchema,
    onSubmit: async (values, { setSubmitting }) => {
      setSubmitting(true);
      try {
        await handleUpdateWithToast(
          CompanyAPI.update(companyId, values),
          'perusahaan'
        );
        router.push(pathname.replace(`/${companyId}/edit`, ''));
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

  if (loading || !initialData) {
    return (
      <MainCard content={false}>
        <CardContent sx={{ border: "none", textAlign: 'center', py: 4 }}>
          <Typography variant="body1">Memuat data...</Typography>
        </CardContent>
      </MainCard>
    );
  }

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

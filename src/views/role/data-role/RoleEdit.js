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
import { usePathname, useRouter, useParams, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import RoleForm from "./RoleForm";
import { initialValues, validationSchema } from "./RoleValidation";
import PageLoading from "@/shared/ui/PageLoading";
import { handleUpdateWithToast, showErrorToast } from "@/shared/utils/toast";

// Mock companies untuk dropdown
const mockCompanies = [
  { id: 1, nama: 'PT Bougenvile Blok' },
  { id: 2, nama: 'PT Kantin FKi 12' },
  { id: 3, nama: 'PT Perusahaan ABC' },
  { id: 4, nama: 'CV XYZ Indonesia' },
  { id: 5, nama: 'PT Global Tech Solutions' },
];

// Mock user types
const mockUserTypes = [
  { id: 1, nama: "Administrator" },
  { id: 2, nama: "Manager" },
  { id: 3, nama: "Operator" },
  { id: 4, nama: "Viewer" },
];

// Placeholder API - replace with actual API service
const RoleAPI = {
  getById: async (id) => {
    // Simulate API call - replace with actual API
    return new Promise((resolve) => {
      setTimeout(() => {
        // Mock data - replace with actual API call
        const mockRole = {
          id: parseInt(id),
          perusahaanId: 1,
          nama: 'Administrator',
          userTipeId: 1,
          deskripsi: 'Akses penuh ke semua fitur sistem',
          izinKeamanan: [
            { id: 1, nama: 'Lihat Dashboard' },
            { id: 2, nama: 'Kelola User' },
            { id: 3, nama: 'Kelola Transaksi' },
          ],
        };
        resolve(mockRole);
      }, 500);
    });
  },
  update: async (id, values) => {
    // Simulate API call
    return new Promise((resolve) => {
      setTimeout(() => {
        console.log("Updating role:", id, values);
        resolve({ success: true });
      }, 1000);
    });
  },
};

export default function RoleEdit() {
  const router = useRouter();
  const pathname = usePathname();
  const params = useParams();
  const searchParams = useSearchParams();
  const roleId = params?.id;
  const companyId = searchParams?.get('companyId');
  const [loading, setLoading] = useState(true);
  const [initialData, setInitialData] = useState(null);

  useEffect(() => {
    const fetchRole = async () => {
      if (!roleId) return;
      
      try {
        setLoading(true);
        const data = await RoleAPI.getById(roleId);
        
        // Transform API data to form values
        const formData = {
          perusahaan: mockCompanies.find(c => c.id === data.perusahaanId) || null,
          nama: data.nama,
          userTipe: mockUserTypes.find(u => u.id === data.userTipeId) || null,
          deskripsi: data.deskripsi || '',
          izinKeamanan: data.izinKeamanan || [],
        };
        
        setInitialData(formData);
      } catch (err) {
        console.error('Error fetching role:', err);
        showErrorToast('Gagal memuat data role');
        router.back();
      } finally {
        setLoading(false);
      }
    };

    fetchRole();
  }, [roleId, router]);

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: initialData || initialValues,
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
        await handleUpdateWithToast(
          RoleAPI.update(roleId, apiValues),
          'peran hak akses'
        );
        // Redirect kembali ke list dengan companyId jika ada
        if (companyId) {
          router.push(`/role/data-role/list?companyId=${companyId}`);
        } else {
          router.push(pathname.replace(`/${roleId}/edit`, '/list'));
        }
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
    return <PageLoading />;
  }

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

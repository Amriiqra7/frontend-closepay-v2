'use client';

import {
  Button,
  CardActions,
  CardContent,
  Divider,
  Stack,
} from '@mui/material';
import LoadingButton from '@/shared/ui/LoadingButton';
import MainCard from '@/shared/ui/MainCard';
import { Form, FormikProvider, useFormik } from 'formik';
import { useRouter, usePathname } from 'next/navigation';
import { useEffect } from 'react';
import UserMerchantForm from './UserMerchantForm';
import { initialValues, validationSchema } from './UserMerchantValidation';
import { handleUpdateWithToast, showErrorToast } from '@/shared/utils/toast';

// Placeholder API - replace with actual API service
const UserMerchantAPI = {
  getById: async (id) => {
    // Simulate API call
    return new Promise((resolve) => {
      setTimeout(() => {
        console.log('Fetching user merchant:', id);
        // Mock data - replace with actual API response
        resolve({
          id,
          username: 'merchant1',
          password: '',
          nama: 'Merchant Test',
          jenisIdentitas: 'ktp',
          noIdentitas: '1234567890',
          noId: 'MER001',
          jenisKelamin: 'laki-laki',
          email: 'merchant@example.com',
          noTelepon: '081234567890',
          tanggalLahir: new Date('1990-01-01'),
          tempatLahir: 'Jakarta',
          alamat: 'Jl. Contoh No. 123',
          roleAccesses: [
            { id: 1, tipe: 'admin', nama: 'Admin - Membership Member Full Control', deskripsi: 'Admin hanya full control CRUD member saja', status: 'Aktif', diizinkan: false },
          ],
        });
      }, 500);
    });
  },
  update: async (id, values) => {
    // Simulate API call
    return new Promise((resolve) => {
      setTimeout(() => {
        console.log('Updating user merchant:', id, values);
        resolve({ success: true });
      }, 1000);
    });
  },
};

export default function UserMerchantEdit({ id }) {
  const router = useRouter();
  const pathname = usePathname();

  const formik = useFormik({
    initialValues,
    validationSchema,
    enableReinitialize: true,
    onSubmit: async (values, { setSubmitting }) => {
      setSubmitting(true);
      try {
        // Transform values untuk API
        const apiValues = {
          ...values,
          tanggalLahir: values.tanggalLahir ? values.tanggalLahir.toISOString() : null,
          roleAccessIds: values.roleAccesses.map((role) => role.id),
        };
        await handleUpdateWithToast(
          UserMerchantAPI.update(id, apiValues),
          'user merchant'
        );
        // Redirect kembali ke list
        router.push('/admin/utama/data-user/user-merchant/data-user');
      } catch (err) {
        // Error already handled by toast
      } finally {
        setSubmitting(false);
      }
    },
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await UserMerchantAPI.getById(id);
        formik.setValues({
          username: data.username || '',
          password: data.password || '',
          nama: data.nama || '',
          jenisIdentitas: data.jenisIdentitas || '',
          noIdentitas: data.noIdentitas || '',
          noId: data.noId || '',
          jenisKelamin: data.jenisKelamin || '',
          email: data.email || '',
          noTelepon: data.noTelepon || '',
          tanggalLahir: data.tanggalLahir ? new Date(data.tanggalLahir) : null,
          tempatLahir: data.tempatLahir || '',
          alamat: data.alamat || '',
          roleAccesses: data.roleAccesses || [],
        });
      } catch (error) {
        showErrorToast(`Gagal memuat data user merchant: ${error.message || 'Terjadi kesalahan'}`);
      }
    };

    if (id) {
      fetchData();
    }
  }, [id]);

  const handleSubmit = (e) => {
    e.preventDefault();
    formik.handleSubmit();

    if (!formik.isValid) {
      showErrorToast('Pastikan semua data wajib telah diisi dengan lengkap dan benar!');
    }
  };

  return (
    <FormikProvider value={formik}>
      <Form autoComplete="off" noValidate onSubmit={handleSubmit}>
        <MainCard content={false}>
          <CardContent sx={{ border: 'none' }}>
            <UserMerchantForm />
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
                    textTransform: 'none',
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
                    textTransform: 'none',
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

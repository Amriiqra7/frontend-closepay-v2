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
import UserAdminForm from './UserAdminForm';
import { initialValues, validationSchema } from './UserAdminValidation';
import { handleUpdateWithToast, showErrorToast } from '@/shared/utils/toast';

// Placeholder API - replace with actual API service
const UserAdminAPI = {
  getById: async (id) => {
    // Simulate API call
    return new Promise((resolve) => {
      setTimeout(() => {
        console.log('Fetching user admin:', id);
        // Mock data - replace with actual API response
        resolve({
          id,
          username: 'adminniktest',
          password: '',
          nama: 'jhonchenko1',
          jenisIdentitas: 'ktp',
          noIdentitas: '060501123',
          noId: '060501123',
          jenisKelamin: 'laki-laki',
          email: 'asdasdasdsa@localhost.sample',
          noTelepon: '0823295123',
          tanggalLahir: new Date('1990-01-01'),
          tempatLahir: 'Jakarta',
          alamat: 'Jl. Contoh No. 123',
          roleAccesses: [],
        });
      }, 500);
    });
  },
  update: async (id, values) => {
    // Simulate API call
    return new Promise((resolve) => {
      setTimeout(() => {
        console.log('Updating user admin:', id, values);
        resolve({ success: true });
      }, 1000);
    });
  },
};

export default function UserAdminEdit({ id }) {
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
          UserAdminAPI.update(id, apiValues),
          'user admin'
        );
        // Redirect kembali ke list
        router.push(pathname.replace(`/${id}/edit`, ''));
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
        const data = await UserAdminAPI.getById(id);
        formik.setValues({
          username: data.username || '',
          password: '',
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
        showErrorToast(`Gagal memuat data user admin: ${error.message || 'Terjadi kesalahan'}`);
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
            <UserAdminForm />
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

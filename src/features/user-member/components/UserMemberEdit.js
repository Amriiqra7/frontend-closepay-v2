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
import UserMemberForm from './UserMemberForm';
import { initialValues, validationSchema } from './UserMemberValidation';
import { handleUpdateWithToast, showErrorToast } from '@/shared/utils/toast';

// Placeholder API - replace with actual API service
const UserMemberAPI = {
  getById: async (id) => {
    // Simulate API call
    return new Promise((resolve) => {
      setTimeout(() => {
        console.log('Fetching user member:', id);
        // Mock data - replace with actual API response
        resolve({
          id,
          username: 'member1',
          nama: 'Member Test',
          noIdentitas: '1234567890',
          noId: '123456',
          nis: 'NIS123',
          email: 'member@example.com',
          noTelepon: '081234567890',
          tanggalLahir: new Date('1990-01-01'),
          tempatLahir: 'Jakarta',
          alamat: 'Jl. Contoh No. 123',
          tags: 'tag1',
        });
      }, 500);
    });
  },
  update: async (id, values) => {
    // Simulate API call
    return new Promise((resolve) => {
      setTimeout(() => {
        console.log('Updating user member:', id, values);
        resolve({ success: true });
      }, 1000);
    });
  },
};

export default function UserMemberEdit({ id }) {
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
        };
        await handleUpdateWithToast(
          UserMemberAPI.update(id, apiValues),
          'user member'
        );
        // Redirect kembali ke list
        router.push('/admin/utama/data-user/user-member/data-user');
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
        const data = await UserMemberAPI.getById(id);
        formik.setValues({
          username: data.username || '',
          nama: data.nama || '',
          noIdentitas: data.noIdentitas || '',
          noId: data.noId || '',
          nis: data.nis || '',
          email: data.email || '',
          noTelepon: data.noTelepon || '',
          tanggalLahir: data.tanggalLahir ? new Date(data.tanggalLahir) : null,
          tempatLahir: data.tempatLahir || '',
          alamat: data.alamat || '',
          tags: data.tags || '',
        });
      } catch (error) {
        showErrorToast(`Gagal memuat data user member: ${error.message || 'Terjadi kesalahan'}`);
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
            <UserMemberForm />
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

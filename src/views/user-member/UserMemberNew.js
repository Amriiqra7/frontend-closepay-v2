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
import UserMemberForm from './UserMemberForm';
import { initialValues, validationSchema } from './UserMemberValidation';
import { handleCreateWithToast, showErrorToast } from '@/shared/utils/toast';

// Placeholder API - replace with actual API service
const UserMemberAPI = {
  create: async (values) => {
    // Simulate API call
    return new Promise((resolve) => {
      setTimeout(() => {
        console.log('Creating user member:', values);
        resolve({ success: true });
      }, 1000);
    });
  },
};

export default function UserMemberNew() {
  const router = useRouter();
  const pathname = usePathname();

  const formik = useFormik({
    initialValues,
    validationSchema,
    onSubmit: async (values, { setSubmitting }) => {
      setSubmitting(true);
      try {
        // Transform values untuk API
        const apiValues = {
          ...values,
          tanggalLahir: values.tanggalLahir ? values.tanggalLahir.toISOString() : null,
        };
        await handleCreateWithToast(
          UserMemberAPI.create(apiValues),
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

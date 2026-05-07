import * as Yup from 'yup';

export const initialValues = {
  perusahaan: null, // Object dari autocomplete
  nama: '',
  userTipe: null, // Object dari autocomplete
  deskripsi: '',
  izinKeamanan: [], // Array of permissions
};

export const validationSchema = Yup.object().shape({
  perusahaan: Yup.object()
    .nullable()
    .required('Perusahaan wajib diisi'),
  nama: Yup.string()
    .required('Nama wajib diisi')
    .max(100, 'Nama maksimal 100 karakter'),
  userTipe: Yup.object()
    .nullable()
    .required('User Tipe wajib diisi'),
  deskripsi: Yup.string()
    .max(500, 'Deskripsi maksimal 500 karakter'),
  izinKeamanan: Yup.array()
    .min(1, 'Pilih minimal satu izin keamanan')
    .required('Izin keamanan wajib diisi'),
});

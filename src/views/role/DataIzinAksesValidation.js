import * as Yup from 'yup';

export const initialValues = {
  servis: '',
  userTipe: '',
  grup: '',
  nama: '',
  kode: '',
  deskripsi: '',
};

export const validationSchema = Yup.object().shape({
  servis: Yup.string()
    .required('Servis wajib diisi'),
  userTipe: Yup.string()
    .required('User Tipe wajib diisi'),
  grup: Yup.string()
    .required('Grup wajib diisi'),
  nama: Yup.string()
    .required('Nama wajib diisi')
    .max(200, 'Nama maksimal 200 karakter'),
  kode: Yup.string()
    .required('Kode wajib diisi')
    .max(100, 'Kode maksimal 100 karakter'),
  deskripsi: Yup.string()
    .max(500, 'Deskripsi maksimal 500 karakter'),
});

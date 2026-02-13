import * as Yup from 'yup';

export const initialValues = {
  username: '',
  password: '',
  nama: '',
  jenisIdentitas: '',
  noIdentitas: '',
  noId: '',
  jenisKelamin: '',
  email: '',
  noTelepon: '',
  tanggalLahir: null,
  tempatLahir: '',
  alamat: '',
  roleAccesses: [], // Array of selected role access objects
};

export const validationSchema = Yup.object().shape({
  username: Yup.string()
    .required('Username wajib diisi')
    .max(100, 'Username maksimal 100 karakter'),
  password: Yup.string().max(255, 'Password maksimal 255 karakter'),
  nama: Yup.string()
    .required('Nama wajib diisi')
    .max(100, 'Nama maksimal 100 karakter'),
  jenisIdentitas: Yup.string(),
  noIdentitas: Yup.string().max(50, 'No Identitas maksimal 50 karakter'),
  noId: Yup.string()
    .required('No ID wajib diisi')
    .max(50, 'No ID maksimal 50 karakter'),
  jenisKelamin: Yup.string(),
  email: Yup.string()
    .email('Format email tidak valid')
    .max(100, 'Email maksimal 100 karakter'),
  noTelepon: Yup.string().max(20, 'No Telepon maksimal 20 karakter'),
  tanggalLahir: Yup.date().nullable(),
  tempatLahir: Yup.string().max(100, 'Tempat Lahir maksimal 100 karakter'),
  alamat: Yup.string().max(500, 'Alamat maksimal 500 karakter'),
  roleAccesses: Yup.array()
    .min(1, 'Pilih minimal satu peran hak akses')
    .required('Peran hak akses wajib diisi'),
});

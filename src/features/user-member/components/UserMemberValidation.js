import * as Yup from 'yup';

export const initialValues = {
  username: '',
  nama: '',
  noIdentitas: '',
  noId: '',
  nis: '',
  email: '',
  noTelepon: '',
  tanggalLahir: null,
  tempatLahir: '',
  alamat: '',
  tags: '', // Single tag selection
};

export const validationSchema = Yup.object().shape({
  username: Yup.string().max(100, 'Username maksimal 100 karakter'),
  nama: Yup.string()
    .required('Nama wajib diisi')
    .max(100, 'Nama maksimal 100 karakter'),
  noIdentitas: Yup.string().max(50, 'No Identitas maksimal 50 karakter'),
  noId: Yup.string().max(50, 'No ID maksimal 50 karakter'), // Optional, akan auto-generate jika kosong
  nis: Yup.string()
    .required('NIS wajib diisi')
    .max(50, 'NIS maksimal 50 karakter'),
  email: Yup.string()
    .required('Email wajib diisi')
    .email('Format email tidak valid')
    .max(100, 'Email maksimal 100 karakter'),
  noTelepon: Yup.string()
    .required('No Telepon wajib diisi')
    .max(20, 'No Telepon maksimal 20 karakter'),
  tanggalLahir: Yup.date()
    .required('Tanggal Lahir wajib diisi')
    .nullable(),
  tempatLahir: Yup.string().max(100, 'Tempat Lahir maksimal 100 karakter'),
  alamat: Yup.string()
    .required('Alamat wajib diisi')
    .max(500, 'Alamat maksimal 500 karakter'),
  tags: Yup.string(),
});

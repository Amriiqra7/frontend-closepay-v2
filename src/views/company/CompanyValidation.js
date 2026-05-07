import * as Yup from 'yup';

export const initialValues = {
  // Informasi Umum
  logo: null,
  name: '',
  companyInitial: '',
  address: '',
  financialType: '',
  billingAccount: '',
  
  // PIC
  picName: '',
  picEmail: '',
  picPhone: '',
  picUsername: '',
  picPassword: '',
  
  // Aplikasi
  homepage: '',
  companyMenus: {
    'Dashboard': false,
    'Transaksi': false,
    'Laporan': false,
    'Pengaturan': false,
    'Manajemen': false,
    'Keuangan': false,
    'Pengguna': false,
  },
};

export const validationSchema = Yup.object().shape({
  name: Yup.string()
    .max(100, 'Nama perusahaan maksimal 100 karakter')
    .required('Nama perusahaan wajib diisi'),
  companyInitial: Yup.string().required('Inisial perusahaan wajib diisi'),
  address: Yup.string().required('Alamat perusahaan wajib diisi'),
  financialType: Yup.string().required('Jenis keuangan perusahaan wajib diisi'),
  billingAccount: Yup.string().required('Rekening penagihan wajib diisi'),
  picName: Yup.string().required('Nama PIC wajib diisi'),
  picEmail: Yup.string()
    .email('Format email tidak valid')
    .required('Email wajib diisi'),
  picPhone: Yup.string().required('No telepon wajib diisi'),
  picUsername: Yup.string().required('Username wajib diisi'),
  picPassword: Yup.string().required('Password wajib diisi'),
  homepage: Yup.string().required('Homepage wajib diisi'),
});

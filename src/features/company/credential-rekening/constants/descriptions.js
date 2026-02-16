// Deskripsi berdasarkan tab
export const getDescription = (activeTab) => {
  switch (activeTab) {
    case 'va':
      return 'Pilih virtual account yang akan diaktifkan di perusahaan terkait. Virtual account akan digunakan untuk top up dan menerima berbagai pembayaran transaksi pada perusahaan.';
    case 'disbursement':
      return 'Pilih metode disbursement untuk diaktifkan pada perusahaan terkait. Pengaktifan disbursement digunakan untuk penarikan saldo dengan tranfer bank ke sesama/antarbank.';
    case 'e-wallet':
      return 'Pilih e-wallet yang akan diaktifkan di perusahaan terkait. E-wallet digunakan sebagai source of funds (sumber saldo) dari member untuk melakukan transaksi dengan cara menyambungkan (linked account) ke channel e-wallet yang aktif pada perusahaan terkait.';
    case 'qris':
      return 'Pilih QRIS yang akan diaktifkan di perusahaan terkait. QRIS akan digunakan untuk menerima berbagai pembayaran transaksi pada perusahaan dengan metode kode QR.';
    case 'va-debit':
      return '';
    default:
      return '';
  }
};

// Cek apakah perlu menampilkan radio button
export const shouldShowRadioButton = (activeTab) => {
  return activeTab === 'va' || activeTab === 'disbursement' || activeTab === 'qris';
};

// Label radio button berdasarkan tab
export const getRadioButtonLabels = (activeTab) => {
  switch (activeTab) {
    case 'va':
      return [
        { value: 'direct-bank', label: 'Direct Bank' },
        { value: 'payment-provider', label: 'Payment Provider' },
      ];
    case 'disbursement':
      return [
        { value: 'direct-bank', label: 'Direct Bank' },
        { value: 'saldo-transfer-perusahaan', label: 'Saldo Transfer Perusahaan' },
      ];
    case 'qris':
      return [
        { value: 'direct-bank', label: 'Direct Bank' },
        { value: 'payment-provider', label: 'Payment Provider' },
      ];
    default:
      return [];
  }
};

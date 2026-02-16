import { allBanks, allProviders, allEWallets } from '../constants/banksAndProviders';

// Fungsi untuk mendapatkan list bank/provider berdasarkan tab dan account type
export const getBankProviderList = (activeTab, accountType) => {
  if (activeTab === 'e-wallet') {
    return Object.values(allEWallets);
  }
  
  if (activeTab === 'va-debit') {
    return [allBanks['bsi']];
  }

  if (activeTab === 'va') {
    if (accountType === 'direct-bank') {
      // VA Direct Bank - semua bank
      return [
        allBanks['bni'],
        allBanks['bri'],
        allBanks['bsi-sbi'],
        allBanks['bankjatim-syariah'],
        allBanks['bsi-cms'],
        allBanks['danamon'],
        allBanks['nanobank-syariah'],
        allBanks['bca'],
      ];
    } else if (accountType === 'payment-provider') {
      // VA Payment Provider
      return [
        allProviders['xendit'],
        allProviders['durianpay'],
        allProviders['fazz'],
        allProviders['linkqu'],
        allProviders['winpay'],
      ];
    }
  }

  if (activeTab === 'disbursement') {
    if (accountType === 'direct-bank') {
      // Disbursement Direct Bank - hanya BNI, BRI, BSI
      return [
        allBanks['bni'],
        allBanks['bri'],
        allBanks['bsi'],
      ];
    }
    // Saldo Transfer Perusahaan tidak perlu list, langsung form
    return [];
  }

  if (activeTab === 'qris') {
    if (accountType === 'direct-bank') {
      // QRIS Direct Bank - hanya BNI, Bank DKI
      return [
        allBanks['bni'],
        allBanks['bank-dki'],
      ];
    } else if (accountType === 'payment-provider') {
      // QRIS Payment Provider
      return [
        allProviders['xendit'],
        allProviders['durianpay'],
        allProviders['fazz'],
      ];
    }
  }

  return [];
};

// Cek apakah sedang di mode Saldo Transfer Perusahaan
export const isSaldoTransferMode = (activeTab, accountType) => {
  return activeTab === 'disbursement' && accountType === 'saldo-transfer-perusahaan';
};

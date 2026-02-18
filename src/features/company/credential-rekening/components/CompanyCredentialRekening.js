'use client';

import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Paper,
  Grid,
  Tabs,
  Tab,
  Radio,
  RadioGroup,
  FormControl,
  FormControlLabel,
  Button,
} from '@mui/material';
import { useParams, useRouter } from 'next/navigation';
import MainCard from '@/shared/ui/MainCard';
import { formatRupiah } from '@/shared/utils/format';
import { tabOptions } from '../constants/tabOptions';
import { getDescription, shouldShowRadioButton, getRadioButtonLabels } from '../constants/descriptions';
import { getBankProviderList, isSaldoTransferMode } from '../utils/bankProviderUtils';
import BankList from './BankList';
import ConfigurationForm from './ConfigurationForm';
import SaldoTransferForm from './SaldoTransferForm';
import PaymentFeesSection from './PaymentFeesSection';
import AdminFeesSection from './AdminFeesSection';
import AddFeeDialog from './AddFeeDialog';

export default function CompanyCredentialRekening() {
  const params = useParams();
  const companyId = params?.id;
  const router = useRouter();

  const [activeTab, setActiveTab] = useState('va');
  const [accountType, setAccountType] = useState('direct-bank');
  const [selectedBank, setSelectedBank] = useState(null);

  const [paymentMethodEnabled, setPaymentMethodEnabled] = useState(false);
  const [credentials, setCredentials] = useState({
    prefix: '',
    clientId: '',
    clientSecret: '',
    host: '',
  });
  const [limits, setLimits] = useState({
    minimal: '',
    maksimal: '',
  });
  const [saldoTransfer, setSaldoTransfer] = useState({
    tipe: '',
    nominal: '',
    keterangan: '',
  });
  const [paymentFees, setPaymentFees] = useState([]);
  const [paymentFeesExpanded, setPaymentFeesExpanded] = useState(false);
  const [addFeeDialogOpen, setAddFeeDialogOpen] = useState(false);
  const [newFee, setNewFee] = useState({
    deskripsi: '',
    tipe: '',
    nilai: '',
  });
  const [adminFeesExpanded, setAdminFeesExpanded] = useState(false);
  const [inhouseFees, setInhouseFees] = useState([]);
  const [interbankFees, setInterbankFees] = useState([]);
  const [addAdminFeeDialogOpen, setAddAdminFeeDialogOpen] = useState(false);
  const [adminFeeType, setAdminFeeType] = useState(null);
  const [newAdminFee, setNewAdminFee] = useState({
    deskripsi: '',
    tipe: '',
    nilai: '',
  });

  // Auto-select bank pertama saat list berubah
  useEffect(() => {
    const bankList = getBankProviderList(activeTab, accountType);
    const isSaldoMode = isSaldoTransferMode(activeTab, accountType);
    
    if (isSaldoMode) {
      setSelectedBank(null);
      return;
    }
    
    if (bankList.length > 0) {
      setSelectedBank((prevBank) => {
        if (!prevBank) {
          return bankList[0];
        }
        if (!bankList.find(b => b.id === prevBank.id)) {
          return bankList[0];
        }
        return prevBank;
      });
    }
  }, [activeTab, accountType]);

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
    if (newValue === 'disbursement') {
      setAccountType('direct-bank');
    } else if (newValue === 'qris') {
      setAccountType('direct-bank');
    } else if (newValue === 'va') {
      setAccountType('direct-bank');
    } else if (newValue === 'e-wallet' || newValue === 'va-debit') {
      setAccountType('');
    }
    setSelectedBank(null);
  };

  const handleAccountTypeChange = (event) => {
    setAccountType(event.target.value);
    setSelectedBank(null);
  };

  const handleSaldoTransferChange = (field, value) => {
    if (field === 'nominal') {
      const formatted = formatRupiah(value);
      setSaldoTransfer((prev) => ({
        ...prev,
        [field]: formatted,
      }));
    } else {
      setSaldoTransfer((prev) => ({
        ...prev,
        [field]: value,
      }));
    }
  };

  const handleBankClick = (bank) => {
    setSelectedBank(bank);
  };

  const handleCredentialChange = (field, value) => {
    setCredentials((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleLimitChange = (field, value) => {
    const formatted = formatRupiah(value);
    setLimits((prev) => ({
      ...prev,
      [field]: formatted,
    }));
  };

  const handleSave = () => {
    console.log('Saving credentials:', {
      companyId,
      activeTab,
      accountType,
      selectedBank,
      paymentMethodEnabled,
      credentials,
      limits,
      saldoTransfer: isSaldoTransferMode(activeTab, accountType) ? saldoTransfer : null,
      paymentFees,
      adminFees: {
        inhouse: inhouseFees,
        interbank: interbankFees,
      },
    });
  };

  const handleAddPaymentFee = () => {
    setAddFeeDialogOpen(true);
  };

  const handleAddPaymentFeeSubmit = () => {
    if (newFee.tipe && newFee.nilai) {
      const fee = {
        id: Date.now(),
        deskripsi: newFee.deskripsi || '',
        tipe: newFee.tipe,
        nilai: newFee.nilai,
      };
      setPaymentFees([...paymentFees, fee]);
      setNewFee({ deskripsi: '', tipe: '', nilai: '' });
      setAddFeeDialogOpen(false);
    }
  };

  const handleDeletePaymentFee = (id) => {
    setPaymentFees(paymentFees.filter(fee => fee.id !== id));
  };

  const handleAddAdminFee = (type) => {
    setAdminFeeType(type);
    setAddAdminFeeDialogOpen(true);
  };

  const handleAddAdminFeeSubmit = () => {
    if (newAdminFee.tipe && newAdminFee.nilai && adminFeeType) {
      const fee = {
        id: Date.now(),
        deskripsi: newAdminFee.deskripsi || '',
        tipe: newAdminFee.tipe,
        nilai: newAdminFee.nilai,
      };
      if (adminFeeType === 'inhouse') {
        setInhouseFees([...inhouseFees, fee]);
      } else if (adminFeeType === 'interbank') {
        setInterbankFees([...interbankFees, fee]);
      }
      setNewAdminFee({ deskripsi: '', tipe: '', nilai: '' });
      setAdminFeeType(null);
      setAddAdminFeeDialogOpen(false);
    }
  };

  const handleDeleteAdminFee = (id, type) => {
    if (type === 'inhouse') {
      setInhouseFees(inhouseFees.filter(fee => fee.id !== id));
    } else if (type === 'interbank') {
      setInterbankFees(interbankFees.filter(fee => fee.id !== id));
    }
  };

  const bankList = getBankProviderList(activeTab, accountType);
  const isSaldoMode = isSaldoTransferMode(activeTab, accountType);

  return (
    <Box sx={{ width: '100%', height: '100%' }}>
      <MainCard content={false} sx={{ p: 0 }}>
        {/* Header */}
        {getDescription(activeTab) && (
          <Box sx={{ p: 3, pb: 2 }}>
            <Typography variant="body2" color="text.secondary" sx={{ fontSize: '0.875rem' }}>
              {getDescription(activeTab)}
            </Typography>
          </Box>
        )}

        {/* Tabs */}
        <Box sx={{ px: 3, borderBottom: '1px solid', borderColor: 'divider' }}>
          <Tabs
            value={activeTab}
            onChange={handleTabChange}
            sx={{
              minHeight: 48,
              '& .MuiTab-root': {
                minHeight: 48,
                textTransform: 'none',
                fontWeight: 500,
                fontSize: '0.875rem',
                color: 'text.secondary',
                px: 2,
                '&.Mui-selected': {
                  color: '#155DFC',
                  fontWeight: 600,
                },
              },
              '& .MuiTabs-indicator': {
                height: 2,
                borderRadius: '2px 2px 0 0',
                bgcolor: '#155DFC',
              },
            }}
          >
            {tabOptions.map((tab) => (
              <Tab key={tab.value} value={tab.value} label={tab.label} />
            ))}
          </Tabs>
        </Box>

        {/* Content */}
        <Box sx={{ p: 3 }}>
          {/* Account Type Selection */}
          {shouldShowRadioButton(activeTab) && (
            <Box sx={{ mb: 3 }}>
              <FormControl component="fieldset">
                <RadioGroup
                  row
                  value={accountType}
                  onChange={handleAccountTypeChange}
                  sx={{
                    '& .MuiFormControlLabel-root': {
                      mr: 3,
                    },
                  }}
                >
                  {getRadioButtonLabels(activeTab).map((option) => (
                    <FormControlLabel
                      key={option.value}
                      value={option.value}
                      control={<Radio size="small" />}
                      label={
                        <Typography sx={{ fontSize: '0.875rem', fontWeight: 500 }}>
                          {option.label}
                        </Typography>
                      }
                    />
                  ))}
                </RadioGroup>
              </FormControl>
            </Box>
          )}

          <Grid container spacing={3} sx={{ alignItems: 'stretch' }}>
            {/* Left Column - Bank/Provider List */}
            {!isSaldoMode && (
              <BankList
                banks={bankList}
                selectedBank={selectedBank}
                onBankClick={handleBankClick}
              />
            )}

            {/* Right Column - Configuration Form */}
            <Grid item xs={12} md={isSaldoMode ? 12 : 8} sx={{ width: '100%', display: { xs: 'block', md: 'flex' }, flex: { md: 1 } }}>
              <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column', width: '100%', minWidth: 0, flex: 1 }}>
                {isSaldoMode ? (
                  <SaldoTransferForm
                    saldoTransfer={saldoTransfer}
                    limits={limits}
                    onSaldoTransferChange={handleSaldoTransferChange}
                    onLimitChange={handleLimitChange}
                    onSave={handleSave}
                  />
                ) : selectedBank ? (
                  <ConfigurationForm
                    selectedBank={selectedBank}
                    paymentMethodEnabled={paymentMethodEnabled}
                    credentials={credentials}
                    limits={limits}
                    activeTab={activeTab}
                    accountType={accountType}
                    onPaymentMethodChange={setPaymentMethodEnabled}
                    onCredentialChange={handleCredentialChange}
                    onLimitChange={handleLimitChange}
                    onSave={handleSave}
                    paymentFees={paymentFees}
                    paymentFeesExpanded={paymentFeesExpanded}
                    onPaymentFeesToggle={() => setPaymentFeesExpanded(!paymentFeesExpanded)}
                    onAddPaymentFee={handleAddPaymentFee}
                    onDeletePaymentFee={handleDeletePaymentFee}
                    adminFeesExpanded={adminFeesExpanded}
                    inhouseFees={inhouseFees}
                    interbankFees={interbankFees}
                    onAdminFeesToggle={() => setAdminFeesExpanded(!adminFeesExpanded)}
                    onAddAdminFee={handleAddAdminFee}
                    onDeleteAdminFee={handleDeleteAdminFee}
                  />
                ) : (
                  <Paper
                    elevation={0}
                    sx={{
                      p: 4,
                      border: '1px solid',
                      borderColor: 'rgba(0, 0, 0, 0.08)',
                      borderRadius: 2,
                      bgcolor: 'background.paper',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      height: '100%',
                      minHeight: '100%',
                      width: '100%',
                      maxWidth: '100%',
                      flex: 1,
                    }}
                  >
                    <Typography variant="body2" color="text.secondary" sx={{ fontSize: '0.875rem' }}>
                      {activeTab === 'e-wallet' 
                        ? 'Pilih e-wallet untuk melihat konfigurasi'
                        : accountType === 'payment-provider'
                        ? 'Pilih payment provider untuk melihat konfigurasi'
                        : 'Pilih bank untuk melihat konfigurasi'}
                    </Typography>
                  </Paper>
                )}
              </Box>
            </Grid>
          </Grid>
        </Box>

        {/* Button Kembali */}
        <Box sx={{ p: 3, pt: 0, display: 'flex', justifyContent: 'flex-start' }}>
          <Button
            variant="outlined"
            onClick={() => router.back()}
            sx={{
              textTransform: 'none',
              color: 'error.main',
              borderColor: 'error.main',
              px: 3,
              '&:hover': {
                borderColor: 'error.main',
                bgcolor: 'error.lighter',
              },
            }}
          >
            Kembali
          </Button>
        </Box>
      </MainCard>

      {/* Dialog Tambah Data Biaya Pembayaran */}
      <AddFeeDialog
        open={addFeeDialogOpen}
        onClose={() => {
          setAddFeeDialogOpen(false);
          setNewFee({ deskripsi: '', tipe: '', nilai: '' });
        }}
        title="Tambah Data Biaya Pembayaran"
        fee={newFee}
        onFeeChange={setNewFee}
        onSubmit={handleAddPaymentFeeSubmit}
      />

      {/* Dialog Tambah Data Biaya Admin */}
      <AddFeeDialog
        open={addAdminFeeDialogOpen}
        onClose={() => {
          setAddAdminFeeDialogOpen(false);
          setAdminFeeType(null);
          setNewAdminFee({ deskripsi: '', tipe: '', nilai: '' });
        }}
        title="Tambah Data Biaya Pembayaran"
        fee={newAdminFee}
        onFeeChange={setNewAdminFee}
        onSubmit={handleAddAdminFeeSubmit}
      />
    </Box>
  );
}

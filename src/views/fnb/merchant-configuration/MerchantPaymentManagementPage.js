"use client";

import React from "react";
import { Box, Button, MenuItem, Paper, Select, Stack, Typography } from "@mui/material";
import { useRouter } from "next/navigation";
import SimpleSwitchField from "../common/SimpleSwitchField";
import { fnbMerchantPaymentConfig } from "@/core/services/api_fnb";
import { getApiErrorMessage, showErrorToast, toastPromise } from "@/shared/utils/toast";

const paymentTypeOptions = [
  { label: "Bayar di Awal", value: "PAY_FIRST" },
  { label: "Bayar di Akhir", value: "PAY_LAST" },
  { label: "Bebas (Awal / Akhir)", value: "PAY_EITHER" },
];

const initialMethods = [
  { key: "cash", label: "Cash", description: "Pembayaran tunai langsung di kasir.", enabled: true },
  { key: "qris", label: "QRIS", description: "Pembayaran scan QR dari aplikasi e-wallet/banking.", enabled: true },
  { key: "va", label: "Virtual Account", description: "Pembayaran melalui nomor VA yang dibuat sistem.", enabled: false },
  { key: "card", label: "Kartu Debit/Kredit", description: "Pembayaran melalui kartu di mesin EDC/terminal.", enabled: false },
];

export default function MerchantPaymentManagementPage() {
  const router = useRouter();
  const [paymentType, setPaymentType] = React.useState(paymentTypeOptions[0].value);
  const [savedPaymentType, setSavedPaymentType] = React.useState(paymentTypeOptions[0].value);
  const [isLoadingConfig, setIsLoadingConfig] = React.useState(true);
  const [isSaving, setIsSaving] = React.useState(false);
  const [paymentMethods, setPaymentMethods] = React.useState(initialMethods);

  React.useEffect(() => {
    let isMounted = true;

    const loadConfig = async () => {
      try {
        setIsLoadingConfig(true);
        const response = await fnbMerchantPaymentConfig.get();
        const apiValue = response?.data?.configPayment;
        const normalized = paymentTypeOptions.some((item) => item.value === apiValue)
          ? apiValue
          : paymentTypeOptions[0].value;

        if (!isMounted) return;

        setPaymentType(normalized);
        setSavedPaymentType(normalized);
      } catch (error) {
        if (!isMounted) return;
        showErrorToast(getApiErrorMessage(error, "Gagal memuat konfigurasi pembayaran merchant."));
      } finally {
        if (!isMounted) return;
        setIsLoadingConfig(false);
      }
    };

    loadConfig();

    return () => {
      isMounted = false;
    };
  }, []);

  const handleToggleMethod = (key) => {
    setPaymentMethods((prev) => prev.map((item) => (item.key === key ? { ...item, enabled: !item.enabled } : item)));
  };

  const isChanged = paymentType !== savedPaymentType;

  const handleCancel = () => {
    router.back();
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await toastPromise(
        fnbMerchantPaymentConfig.update({
          configPayment: paymentType,
        }),
        {
          loading: "Menyimpan konfigurasi pembayaran...",
          success: "Konfigurasi pembayaran berhasil disimpan.",
          error: (error) => getApiErrorMessage(error, "Gagal menyimpan konfigurasi pembayaran."),
        }
      );

      setSavedPaymentType(paymentType);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Stack spacing={2}>
      <Paper elevation={0} sx={{ border: "1px solid #e8edf3", borderRadius: 3, p: 3 }}>
        <Stack spacing={3}>
          <Box>
            <Typography sx={{ mb: 0.8, color: "#334155", fontWeight: 400, fontSize: "0.88rem" }}>Jenis Pembayaran</Typography>
            <Select
              fullWidth
              value={paymentType}
              onChange={(event) => setPaymentType(event.target.value)}
              displayEmpty
              disabled={isLoadingConfig || isSaving}
            >
              {paymentTypeOptions.map((option) => (
                <MenuItem key={option.value} value={option.value}>
                  {option.label}
                </MenuItem>
              ))}
            </Select>
          </Box>

          <Box>
            <Typography sx={{ mb: 1.2, color: "#334155", fontWeight: 400, fontSize: "0.88rem" }}>
              Metode Pembayaran yang Diizinkan
            </Typography>
            <Stack spacing={1.25}>
              {paymentMethods.map((method) => (
                <Box key={method.key}>
                  <SimpleSwitchField
                    label={method.label}
                    checked={method.enabled}
                    onChange={() => handleToggleMethod(method.key)}
                    disabled
                  />
                  <Typography sx={{ fontSize: "0.82rem", color: "#64748b", mt: 0.2 }}>{method.description}</Typography>
                </Box>
              ))}
            </Stack>
          </Box>
        </Stack>
      </Paper>

      <Stack direction="row" spacing={1.2} justifyContent="flex-end">
        <Button variant="outlined" onClick={handleCancel} disabled={isSaving}>
          Cancel
        </Button>
        <Button variant="contained" onClick={handleSave} disabled={isLoadingConfig || isSaving || !isChanged}>
          Save
        </Button>
      </Stack>
    </Stack>
  );
}

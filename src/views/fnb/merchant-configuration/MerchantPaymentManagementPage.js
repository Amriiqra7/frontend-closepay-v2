"use client";

import React from "react";
import { Box, MenuItem, Paper, Select, Stack, Typography } from "@mui/material";
import SimpleSwitchField from "../common/SimpleSwitchField";

const paymentTypeOptions = [
  { label: "Bayar di Awal", value: "pay_first" },
  { label: "Bayar di Akhir", value: "pay_later" },
];

const initialMethods = [
  { key: "cash", label: "Cash", description: "Pembayaran tunai langsung di kasir.", enabled: true },
  { key: "qris", label: "QRIS", description: "Pembayaran scan QR dari aplikasi e-wallet/banking.", enabled: true },
  { key: "va", label: "Virtual Account", description: "Pembayaran melalui nomor VA yang dibuat sistem.", enabled: false },
  { key: "card", label: "Kartu Debit/Kredit", description: "Pembayaran melalui kartu di mesin EDC/terminal.", enabled: false },
];

export default function MerchantPaymentManagementPage() {
  const [paymentType, setPaymentType] = React.useState(paymentTypeOptions[0].value);
  const [paymentMethods, setPaymentMethods] = React.useState(initialMethods);

  const handleToggleMethod = (key) => {
    setPaymentMethods((prev) => prev.map((item) => (item.key === key ? { ...item, enabled: !item.enabled } : item)));
  };

  return (
    <Box>
      <Paper elevation={0} sx={{ border: "1px solid #e8edf3", borderRadius: 3, p: 3 }}>
        <Stack spacing={3}>
          <Box>
            <Typography sx={{ mb: 0.8, color: "#334155", fontWeight: 400, fontSize: "0.88rem" }}>Jenis Pembayaran</Typography>
            <Select fullWidth value={paymentType} onChange={(event) => setPaymentType(event.target.value)} displayEmpty>
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
                  />
                  <Typography sx={{ fontSize: "0.82rem", color: "#64748b", mt: 0.2 }}>{method.description}</Typography>
                </Box>
              ))}
            </Stack>
          </Box>
        </Stack>
      </Paper>
    </Box>
  );
}

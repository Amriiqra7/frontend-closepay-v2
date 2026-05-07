"use client";

import React from "react";
import { QRCode } from "antd";
import { Box, Button, Paper, Typography } from "@mui/material";
import { fnbMerchantQrCode } from "@/core/services/api_fnb";
import { getApiErrorMessage, showErrorToast, showSuccessToast } from "@/shared/utils/toast";

export default function FnbGenerateQrPage() {
  const [isGenerating, setIsGenerating] = React.useState(false);
  const [qrValue, setQrValue] = React.useState("");

  const handleGenerateQr = React.useCallback(async () => {
    setIsGenerating(true);
    try {
      const response = await fnbMerchantQrCode.generate({});
      const nextQrValue = response?.data?.qrCode || "";

      if (!nextQrValue) {
        showErrorToast("QR code tidak ditemukan di response.");
        return;
      }

      setQrValue(nextQrValue);
      showSuccessToast("QR code berhasil digenerate.");
    } catch (error) {
      showErrorToast(getApiErrorMessage(error, "Gagal generate QR code."));
    } finally {
      setIsGenerating(false);
    }
  }, []);

  return (
    <Box sx={{ width: "100%" }}>
      <Paper
        elevation={0}
        sx={{
          width: "100%",
          borderRadius: 3,
          border: "1px solid #e8edf3",
          p: { xs: 2.5, md: 4 },
          minHeight: { xs: 420, md: 520 },
          textAlign: "center",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Typography sx={{ fontSize: "1.15rem", fontWeight: 700, color: "#111827" }}>Generate QR Merchant</Typography>
        <Typography sx={{ fontSize: "0.9rem", color: "#6b7280", mt: 1 }}>
          Klik tombol di bawah untuk generate QR code merchant terbaru.
        </Typography>

        <Button
          variant="contained"
          onClick={handleGenerateQr}
          disabled={isGenerating}
          sx={{ mt: 3, textTransform: "none", minWidth: 180 }}
        >
          {isGenerating ? "Generating..." : "Generate QR"}
        </Button>

        {qrValue ? (
          <Box sx={{ mt: 4, display: "flex", justifyContent: "center" }}>
            <QRCode value={qrValue} size={260} />
          </Box>
        ) : null}
      </Paper>
    </Box>
  );
}

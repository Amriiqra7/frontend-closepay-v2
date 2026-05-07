"use client";

import React from "react";
import Link from "next/link";
import { Box, Button, Paper, TextField, Typography } from "@mui/material";
import { ArrowLeft2 } from "iconsax-react";

export default function ProfilMerchantPage() {
  const [form, setForm] = React.useState({
    logoUrl: "",
    namaMerchant: "",
    alamatMerchant: "",
    deskripsiMerchant: "",
    emailMerchant: "",
  });

  const handleChange = (key) => (event) => {
    setForm((prev) => ({ ...prev, [key]: event.target.value }));
  };

  const hasLogo = form.logoUrl.trim().length > 0;

  return (
    <Box>
      <Paper elevation={0} sx={{ border: "1px solid #e8edf3", borderRadius: 3, p: 3, mb: 2 }}>
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: { xs: "1fr", md: "repeat(2, minmax(0, 1fr))" },
            gap: 2,
          }}
        >
          <Box sx={{ gridColumn: "1 / -1" }}>
            <Typography sx={{ mb: 0.8, color: "#334155", fontWeight: 400, fontSize: "0.88rem" }}>
              Logo Merchant (Image URL)
            </Typography>
            <TextField
              placeholder="https://contoh.com/logo-merchant.png"
              fullWidth
              value={form.logoUrl}
              onChange={handleChange("logoUrl")}
            />
          </Box>

          <Box sx={{ gridColumn: "1 / -1" }}>
            <Box
              sx={{
                border: "1px dashed #cfd8e3",
                borderRadius: 2,
                height: 220,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                overflow: "hidden",
                bgcolor: "#f8fafc",
              }}
            >
              {hasLogo ? (
                <img
                  src={form.logoUrl}
                  alt="Preview Logo Merchant"
                  style={{ maxHeight: "100%", maxWidth: "100%", objectFit: "contain" }}
                />
              ) : (
                <Typography sx={{ color: "#94a3b8", fontSize: "0.9rem" }}>Preview logo akan tampil di sini</Typography>
              )}
            </Box>
          </Box>

          <Box>
            <Typography sx={{ mb: 0.8, color: "#334155", fontWeight: 400, fontSize: "0.88rem" }}>Nama Merchant</Typography>
            <TextField fullWidth value={form.namaMerchant} onChange={handleChange("namaMerchant")} />
          </Box>

          <Box>
            <Typography sx={{ mb: 0.8, color: "#334155", fontWeight: 400, fontSize: "0.88rem" }}>Email Merchant</Typography>
            <TextField type="email" fullWidth value={form.emailMerchant} onChange={handleChange("emailMerchant")} />
          </Box>

          <Box sx={{ gridColumn: "1 / -1" }}>
            <Typography sx={{ mb: 0.8, color: "#334155", fontWeight: 400, fontSize: "0.88rem" }}>Alamat Merchant</Typography>
            <TextField fullWidth value={form.alamatMerchant} onChange={handleChange("alamatMerchant")} />
          </Box>

          <Box sx={{ gridColumn: "1 / -1" }}>
            <Typography sx={{ mb: 0.8, color: "#334155", fontWeight: 400, fontSize: "0.88rem" }}>Deskripsi Merchant</Typography>
            <TextField
              fullWidth
              multiline
              minRows={4}
              value={form.deskripsiMerchant}
              onChange={handleChange("deskripsiMerchant")}
            />
          </Box>
        </Box>
      </Paper>
    </Box>
  );
}


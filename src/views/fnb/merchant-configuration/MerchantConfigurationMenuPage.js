"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { Box, Paper, Stack, Typography } from "@mui/material";
import { MenuBoard, Shop, ToggleOn, Truck, WalletMoney } from "iconsax-react";

const subMenus = [
  {
    id: "profil-merchant",
    href: "/fnb/konfigurasi-merchant/profil-merchant",
    title: "Profil Merchant",
    description: "Atur data identitas merchant seperti logo, nama, alamat, deskripsi, dan email.",
    icon: Shop,
  },
  {
    id: "manajemen-pembayaran",
    href: "/fnb/konfigurasi-merchant/manajemen-pembayaran",
    title: "Manajemen Pembayaran",
    description: "Tentukan jenis pembayaran serta metode pembayaran yang diizinkan di merchant.",
    icon: WalletMoney,
  },
  {
    id: "manajemen-meja",
    href: "/fnb/konfigurasi-merchant/manajemen-meja",
    title: "Manajemen Meja",
    description: "Kelola QR meja: input jumlah meja, tampilkan list table, dan unduh QR satuan atau semua.",
    icon: MenuBoard,
  },
  {
    id: "manajemen-fitur",
    href: "/fnb/konfigurasi-merchant/manajemen-fitur",
    title: "Manajemen Fitur",
    description: "Aktifkan atau nonaktifkan fitur operasional merchant sesuai kebutuhan.",
    icon: ToggleOn,
  },
  {
    id: "manajemen-marketplace",
    href: "/fnb/konfigurasi-merchant/manajemen-marketplace",
    title: "Manajemen Marketplace",
    description: "Atur pengiriman merchant dan kebutuhan approval pesanan dari channel dine in.",
    icon: Truck,
  },
];

function MenuCard({ title, description, Icon, onClick }) {
  return (
    <Paper
      elevation={0}
      onClick={onClick}
      sx={{
        border: "1px solid #e8edf3",
        borderRadius: 3,
        p: 3,
        minHeight: 210,
        bgcolor: "#ffffff",
        transition: "all 0.2s ease",
        cursor: "pointer",
        "&:hover": {
          borderColor: "#155DFC",
          boxShadow: "0 10px 26px rgba(21, 93, 252, 0.12)",
          transform: "translateY(-2px)",
        },
      }}
    >
      <Stack spacing={2.25}>
        <Box
          sx={{
            width: 60,
            height: 60,
            borderRadius: 2.5,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            bgcolor: "rgba(21, 93, 252, 0.10)",
          }}
        >
          <Icon size={30} color="#155DFC" variant="Bulk" />
        </Box>
        <Box>
          <Typography sx={{ fontSize: "1.05rem", fontWeight: 700, color: "#1f2937", mb: 0.8 }}>{title}</Typography>
          <Typography sx={{ color: "#6b7280", fontSize: "0.87rem", lineHeight: 1.55 }}>{description}</Typography>
        </Box>
      </Stack>
    </Paper>
  );
}

export default function MerchantConfigurationMenuPage() {
  const router = useRouter();

  return (
    <Box>
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: { xs: "1fr", sm: "repeat(2, minmax(0, 1fr))", lg: "repeat(3, minmax(0, 1fr))" },
          gap: 2.5,
        }}
      >
        {subMenus.map((item) => (
          <MenuCard
            key={item.id}
            title={item.title}
            description={item.description}
            Icon={item.icon}
            onClick={() => router.push(item.href)}
          />
        ))}
      </Box>
    </Box>
  );
}


"use client";

import React from "react";
import Link from "next/link";
import { Box, Button, Paper, Stack, Switch, Typography } from "@mui/material";
import { ArrowLeft2 } from "iconsax-react";

const initialFeatureState = [
  { key: "inventory", label: "Inventory", enabled: true },
  { key: "distribution", label: "Distribusi", enabled: true },
  { key: "stockOpname", label: "Stock Opname", enabled: true },
];

export default function ManajemenFiturPage() {
  const [features, setFeatures] = React.useState(initialFeatureState);

  const handleToggle = (key) => {
    setFeatures((prev) => prev.map((item) => (item.key === key ? { ...item, enabled: !item.enabled } : item)));
  };

  return (
    <Box>
      <Paper elevation={0} sx={{ border: "1px solid #e8edf3", borderRadius: 3, p: 3 }}>
        <Stack spacing={1.25}>
          {features.map((feature) => (
            <Box
              key={feature.key}
              sx={{
                border: "1px solid #e2e8f0",
                borderRadius: 2,
                p: 1.5,
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                bgcolor: feature.enabled ? "rgba(21, 93, 252, 0.04)" : "#fff",
              }}
            >
              <Typography sx={{ fontSize: "0.95rem", fontWeight: 600, color: "#1f2937" }}>{feature.label}</Typography>
              <Switch checked={feature.enabled} onChange={() => handleToggle(feature.key)} />
            </Box>
          ))}
        </Stack>
      </Paper>
    </Box>
  );
}

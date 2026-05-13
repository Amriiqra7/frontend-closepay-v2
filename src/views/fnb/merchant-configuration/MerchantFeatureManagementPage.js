"use client";

import React from "react";
import { Box, Paper, Stack } from "@mui/material";
import SimpleSwitchField from "../common/SimpleSwitchField";

const initialFeatureState = [
  { key: "inventory", label: "Inventory", enabled: true },
  { key: "distribution", label: "Distribusi", enabled: true },
  { key: "stockOpname", label: "Stock Opname", enabled: true },
];

export default function MerchantFeatureManagementPage() {
  const [features, setFeatures] = React.useState(initialFeatureState);

  const handleToggle = (key) => {
    setFeatures((prev) => prev.map((item) => (item.key === key ? { ...item, enabled: !item.enabled } : item)));
  };

  return (
    <Box>
      <Paper elevation={0} sx={{ border: "1px solid #e8edf3", borderRadius: 3, p: 3 }}>
        <Stack spacing={1.25}>
          {features.map((feature) => (
            <SimpleSwitchField
              key={feature.key}
              label={feature.label}
              checked={feature.enabled}
              onChange={() => handleToggle(feature.key)}
            />
          ))}
        </Stack>
      </Paper>
    </Box>
  );
}

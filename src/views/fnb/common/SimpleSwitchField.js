"use client";

import React from "react";
import { Box, Switch, Typography } from "@mui/material";

export default function SimpleSwitchField({
  label,
  checked,
  onChange,
  disabled = false,
  labelSx = {},
  sx = {},
}) {
  return (
    <Box sx={{ display: "flex", flexDirection: "column", alignItems: "flex-start", gap: 0.75, ...sx }}>
      <Typography sx={{ color: "#374151", fontSize: "0.875rem", fontWeight: 500, ...labelSx }}>
        {label}
      </Typography>
      <Switch
        checked={checked}
        onChange={onChange}
        size="small"
        disabled={disabled}
        sx={{
          ml: -1,
          "& .MuiSwitch-switchBase.Mui-checked": { color: "#155DFC" },
          "& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track": {
            bgcolor: "#155DFC",
            opacity: 1,
          },
        }}
      />
    </Box>
  );
}

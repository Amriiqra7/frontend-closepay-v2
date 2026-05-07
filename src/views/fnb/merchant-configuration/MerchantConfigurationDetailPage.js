"use client";

import React from "react";
import { Box, Paper, Stack, Typography } from "@mui/material";

export default function MerchantConfigurationDetailPage({ title, description, items }) {
  return (
    <Box>
      <Paper elevation={0} sx={{ border: "1px solid #e8edf3", borderRadius: 3, p: 3 }}>
        <Typography sx={{ fontSize: "1.2rem", fontWeight: 700, color: "#1f2937", mb: 1 }}>{title}</Typography>
        <Typography sx={{ color: "#6b7280", fontSize: "0.92rem", mb: 2 }}>{description}</Typography>
        <Stack spacing={1.2}>
          {items.map((item) => (
            <Box key={item} sx={{ borderRadius: 1.5, bgcolor: "#f8faff", px: 1.5, py: 1.2 }}>
              <Typography sx={{ color: "#1f2937", fontSize: "0.9rem", fontWeight: 500 }}>{item}</Typography>
            </Box>
          ))}
        </Stack>
      </Paper>
    </Box>
  );
}


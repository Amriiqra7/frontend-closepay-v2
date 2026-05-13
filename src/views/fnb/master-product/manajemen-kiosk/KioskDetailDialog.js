"use client";

import React from "react";
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  TextField,
  Typography,
} from "@mui/material";

const readOnlyInputSx = {
  "& .MuiInputBase-input": {
    fontSize: "0.8125rem",
    py: 1,
  },
};

const formatDateTime = (value) => {
  if (!value) return "-";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "-";
  return date.toLocaleString("id-ID", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });
};

function ReadOnlyField({ label, value }) {
  return (
    <Box>
      <Typography sx={{ color: "#64748b", mb: 0.5, fontSize: "0.8125rem" }}>{label}</Typography>
      <TextField fullWidth size="small" value={value ?? "-"} InputProps={{ readOnly: true }} sx={readOnlyInputSx} />
    </Box>
  );
}

export default function KioskDetailDialog({ open, onClose, data, loading = false }) {
  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="md">
      <DialogTitle sx={{ px: 3, py: 1.5, fontWeight: 500, fontSize: "1rem" }}>
        <Typography sx={{ fontSize: "1rem", fontWeight: 500, color: "#1f2937" }}>Information</Typography>
      </DialogTitle>
      <Divider />
      <DialogContent sx={{ px: 3, py: 3 }}>
        {loading ? (
          <Typography sx={{ color: "#6b7280" }}>Memuat detail kiosk...</Typography>
        ) : (
          <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" }, gap: 2 }}>
            <ReadOnlyField label="Device Code" value={data?.deviceCode || "-"} />
            <ReadOnlyField label="Device Name" value={data?.deviceName || "-"} />
            <ReadOnlyField label="Device Type" value={data?.deviceType || "-"} />
            <ReadOnlyField label="Status" value={typeof data?.isActive === "boolean" ? (data.isActive ? "Aktif" : "Tidak Aktif") : "-"} />
          </Box>
        )}
      </DialogContent>
      <DialogActions sx={{ px: 3, py: 2.5 }}>
        <Button
          variant="contained"
          onClick={onClose}
          sx={{
            bgcolor: "#e5e7eb",
            color: "#111827",
            boxShadow: "none",
            textTransform: "none",
            "&:hover": { bgcolor: "#d1d5db", boxShadow: "none" },
          }}
        >
          Tutup
        </Button>
      </DialogActions>
    </Dialog>
  );
}


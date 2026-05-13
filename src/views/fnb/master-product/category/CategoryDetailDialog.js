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

export default function CategoryDetailDialog({ open, onClose, data, loading = false }) {
  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="md">
      <DialogTitle sx={{ px: 3, py: 1.5, fontWeight: 500, fontSize: "1rem" }}>
        <Typography sx={{ fontSize: "1rem", fontWeight: 500, color: "#1f2937" }}>Detail Kategori</Typography>
      </DialogTitle>
      <Divider />
      <DialogContent sx={{ px: 3, py: 3 }}>
        {loading ? (
          <Typography sx={{ color: "#6b7280" }}>Memuat detail kategori...</Typography>
        ) : (
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" },
              gap: 2,
            }}
          >
            <Box>
              <Typography sx={{ color: "#64748b", mb: 0.5, fontSize: "0.8125rem" }}>Nama</Typography>
              <TextField fullWidth size="small" value={data?.name || "-"} InputProps={{ readOnly: true }} sx={readOnlyInputSx} />
            </Box>
            <Box>
              <Typography sx={{ color: "#64748b", mb: 0.5, fontSize: "0.8125rem" }}>Sort Order</Typography>
              <TextField fullWidth size="small" value={String(data?.sortOrder ?? "-")} InputProps={{ readOnly: true }} sx={readOnlyInputSx} />
            </Box>
            <Box>
              <Typography sx={{ color: "#64748b", mb: 0.5, fontSize: "0.8125rem" }}>Status</Typography>
              <TextField
                fullWidth
                size="small"
                value={typeof data?.isActive === "boolean" ? (data.isActive ? "Aktif" : "Tidak Aktif") : "-"}
                InputProps={{ readOnly: true }}
                sx={readOnlyInputSx}
              />
            </Box>
            <Box sx={{ gridColumn: { xs: "1 / -1", md: "1 / -1" } }}>
              <Typography sx={{ color: "#64748b", mb: 0.5, fontSize: "0.8125rem" }}>Deskripsi</Typography>
              <TextField
                fullWidth
                size="small"
                value={data?.description || "-"}
                InputProps={{ readOnly: true }}
                sx={readOnlyInputSx}
              />
            </Box>
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

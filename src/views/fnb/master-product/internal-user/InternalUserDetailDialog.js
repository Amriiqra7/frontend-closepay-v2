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
  IconButton,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { CloseCircle } from "iconsax-react";

const readOnlyFieldSx = {
  "& .MuiInputBase-root": {
    height: 44,
  },
  "& .MuiOutlinedInput-root": {
    bgcolor: "#f1f5f9",
    borderRadius: "12px",
    "& fieldset": {
      borderColor: "#d4dbe5",
    },
    "&:hover fieldset": {
      borderColor: "#d4dbe5",
    },
    "&.Mui-focused fieldset": {
      borderColor: "#d4dbe5",
    },
  },
};

const resolveDetail = (data) => data?.data || data || {};

export default function InternalUserDetailDialog({ open, onClose, loading, data }) {
  const detail = resolveDetail(data);
  const rolesValue = Array.isArray(detail?.roles) ? detail.roles.join(", ") : detail?.roles || "-";
  const statusValue =
    typeof detail?.isActive === "boolean" ? (detail.isActive ? "Aktif" : "Tidak Aktif") : "-";
  const emailValue = detail?.email || "-";
  const phoneValue = detail?.phone || detail?.noTelp || detail?.phoneNumber || "-";

  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullWidth
      maxWidth="xl"
      PaperProps={{
        sx: {
          borderRadius: 2,
          bgcolor: "#eef2f5",
        },
      }}
    >
      <DialogTitle sx={{ px: 3, py: 1.5 }}>
        <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <Typography sx={{ fontSize: "1rem", fontWeight: 500, color: "#1f2937" }}>Information</Typography>
          <IconButton onClick={onClose} size="small" sx={{ color: "#64748b" }}>
            <CloseCircle size={20} />
          </IconButton>
        </Box>
      </DialogTitle>
      <Divider sx={{ borderColor: "#d8dde6" }} />
      <DialogContent sx={{ px: 3, py: 3 }}>
        {loading ? (
          <Typography sx={{ color: "#6b7280" }}>Memuat detail...</Typography>
        ) : (
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" },
              gap: 2.5,
            }}
          >
            <Stack spacing={2.1}>
              <Box>
                <Typography sx={{ mb: 0.75, color: "#64748b", fontSize: "0.92rem" }}>Nama</Typography>
                <TextField fullWidth size="small" value={detail?.name || "-"} InputProps={{ readOnly: true }} sx={readOnlyFieldSx} />
              </Box>
              <Box>
                <Typography sx={{ mb: 0.75, color: "#64748b", fontSize: "0.92rem" }}>Username</Typography>
                <TextField fullWidth size="small" value={detail?.username || "-"} InputProps={{ readOnly: true }} sx={readOnlyFieldSx} />
              </Box>
              <Box>
                <Typography sx={{ mb: 0.75, color: "#64748b", fontSize: "0.92rem" }}>No ID</Typography>
                <TextField fullWidth size="small" value={detail?.noId || "-"} InputProps={{ readOnly: true }} sx={readOnlyFieldSx} />
              </Box>
              <Box>
                <Typography sx={{ mb: 0.75, color: "#64748b", fontSize: "0.92rem" }}>Roles</Typography>
                <TextField fullWidth size="small" value={rolesValue} InputProps={{ readOnly: true }} sx={readOnlyFieldSx} />
              </Box>
            </Stack>

            <Stack spacing={2.1}>
              <Box>
                <Typography sx={{ mb: 0.75, color: "#64748b", fontSize: "0.92rem" }}>Email</Typography>
                <TextField fullWidth size="small" value={emailValue} InputProps={{ readOnly: true }} sx={readOnlyFieldSx} />
              </Box>
              <Box>
                <Typography sx={{ mb: 0.75, color: "#64748b", fontSize: "0.92rem" }}>Telepon</Typography>
                <TextField fullWidth size="small" value={phoneValue} InputProps={{ readOnly: true }} sx={readOnlyFieldSx} />
              </Box>
              <Box>
                <Typography sx={{ mb: 0.75, color: "#64748b", fontSize: "0.92rem" }}>Status</Typography>
                <TextField fullWidth size="small" value={statusValue} InputProps={{ readOnly: true }} sx={readOnlyFieldSx} />
              </Box>
            </Stack>
          </Box>
        )}
      </DialogContent>
      <DialogActions sx={{ px: 3, py: 2.5 }}>
        <Button
          variant="contained"
          onClick={onClose}
          sx={{ bgcolor: "#e5e7eb", color: "#111827", boxShadow: "none", textTransform: "none" }}
        >
          Tutup
        </Button>
      </DialogActions>
    </Dialog>
  );
}

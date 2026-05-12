"use client";

import React from "react";
import { QRCode } from "antd";
import { Box, Button, Dialog, DialogActions, DialogContent, DialogTitle, Typography } from "@mui/material";
import { downloadQrFromContainer } from "./qrDownload";

export default function GenerateQrDetailDialog({ open, onClose, loading, data, onPreviewQr }) {
  const qrRef = React.useRef(null);

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle sx={{ fontWeight: 800 }}>Detail QR Meja</DialogTitle>
      <DialogContent dividers>
        {loading ? (
          <Typography sx={{ color: "#6b7280", fontSize: "0.9rem" }}>Memuat detail...</Typography>
        ) : data ? (
          <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
            <Box>
              <Typography sx={{ color: "#6b7280", fontSize: "0.8rem", mb: 0.25 }}>Nomor Meja</Typography>
              <Typography sx={{ color: "#111827", fontSize: "0.95rem", fontWeight: 700 }}>
                {data.tableNumber ?? "-"}
              </Typography>
            </Box>
            <Box>
              <Typography sx={{ color: "#6b7280", fontSize: "0.8rem", mb: 0.5 }}>QR Code</Typography>
              {data.qrCode ? (
                <>
                  <Box
                    ref={qrRef}
                    onClick={() => onPreviewQr?.(data.qrCode, data.tableNumber)}
                    sx={{ width: "fit-content", cursor: "zoom-in" }}
                  >
                    <QRCode value={data.qrCode} size={200} />
                  </Box>
                  <Button
                    size="small"
                    variant="outlined"
                    sx={{ mt: 1, textTransform: "none" }}
                    onClick={() =>
                      downloadQrFromContainer(qrRef.current, `qr-meja-${data?.tableNumber ?? "unknown"}.png`)
                    }
                  >
                    Download QR
                  </Button>
                </>
              ) : null}
            </Box>
          </Box>
        ) : (
          <Typography sx={{ color: "#6b7280", fontSize: "0.9rem" }}>Data detail tidak ditemukan.</Typography>
        )}
      </DialogContent>
      <DialogActions sx={{ px: 3, py: 2 }}>
        <Button variant="outlined" onClick={onClose}>
          Tutup
        </Button>
      </DialogActions>
    </Dialog>
  );
}

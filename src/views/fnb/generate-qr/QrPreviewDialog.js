"use client";

import React from "react";
import { QRCode } from "antd";
import { Box, Button, Dialog, DialogActions, DialogContent, DialogTitle, Typography } from "@mui/material";
import { downloadQrFromContainer } from "./qrDownload";

export default function QrPreviewDialog({ open, onClose, qrValue, tableNumber, title = "Preview QR" }) {
  const qrRef = React.useRef(null);

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle sx={{ fontWeight: 800 }}>{title}</DialogTitle>
      <DialogContent dividers>
        {qrValue ? (
          <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 1.25 }}>
            <Box ref={qrRef}>
              <QRCode value={qrValue} size={320} />
            </Box>
            <Button
              variant="outlined"
              onClick={() =>
                downloadQrFromContainer(qrRef.current, `qr-meja-${tableNumber ?? "unknown"}-preview.png`)
              }
              sx={{ textTransform: "none" }}
            >
              Download QR
            </Button>
          </Box>
        ) : (
          <Typography sx={{ color: "#6b7280", fontSize: "0.9rem" }}>QR tidak tersedia.</Typography>
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

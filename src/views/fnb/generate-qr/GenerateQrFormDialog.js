"use client";

import React from "react";
import { QRCode } from "antd";
import { Box, Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField, Typography } from "@mui/material";
import { downloadQrFromContainer } from "./qrDownload";

export default function GenerateQrFormDialog({
  open,
  onClose,
  totalTable,
  onTotalTableChange,
  onSubmit,
  submitting,
  generatedRows = [],
  onPreviewQr,
}) {
  const hasGenerated = generatedRows.length > 0;
  const qrRefs = React.useRef({});

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="md">
      <DialogTitle sx={{ fontWeight: 800 }}>Generate QR Meja</DialogTitle>
      <DialogContent dividers>
        <Typography sx={{ color: "#111827", fontSize: "0.85rem", fontWeight: 400, mb: 0.75 }}>
          Jumlah/Nomor Meja
        </Typography>
        <TextField
          autoFocus
          fullWidth
          size="small"
          type="number"
          value={totalTable}
          onChange={onTotalTableChange}
          inputProps={{ min: 1 }}
          disabled={hasGenerated}
        />
        {hasGenerated ? (
          <Box sx={{ mt: 2.5 }}>
            <Typography sx={{ color: "#111827", fontSize: "0.88rem", fontWeight: 700, mb: 1.25 }}>
              Hasil Generate Terakhir
            </Typography>
            <Box sx={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(120px, 1fr))", gap: 1.25 }}>
              {generatedRows.map((item) => (
                <Box
                  key={item?._id || `table-${item?.tableNumber}`}
                  sx={{
                    border: "1px solid #e5e7eb",
                    borderRadius: 1.5,
                    p: 1,
                    textAlign: "center",
                  }}
                >
                  <Typography sx={{ color: "#111827", fontSize: "0.8rem", fontWeight: 700, mb: 0.5 }}>
                    Meja {item?.tableNumber ?? "-"}
                  </Typography>
                  {item?.qrCode ? (
                    <>
                      <Box
                        ref={(node) => {
                          qrRefs.current[item?._id || `table-${item?.tableNumber}`] = node;
                        }}
                        onClick={() => onPreviewQr?.(item.qrCode, item.tableNumber)}
                        sx={{ width: "fit-content", mx: "auto", cursor: "zoom-in" }}
                      >
                        <QRCode value={item.qrCode} size={86} />
                      </Box>
                      <Button
                        size="small"
                        variant="outlined"
                        sx={{ mt: 0.75, minWidth: 0, textTransform: "none", fontSize: "0.72rem", px: 1 }}
                        onClick={(event) => {
                          event.stopPropagation();
                          const key = item?._id || `table-${item?.tableNumber}`;
                          const fileName = `qr-meja-${item?.tableNumber ?? "unknown"}.png`;
                          downloadQrFromContainer(qrRefs.current[key], fileName);
                        }}
                      >
                        Download QR
                      </Button>
                    </>
                  ) : (
                    <Typography sx={{ color: "#6b7280", fontSize: "0.78rem" }}>QR tidak ada</Typography>
                  )}
                </Box>
              ))}
            </Box>
          </Box>
        ) : null}
      </DialogContent>
      <DialogActions sx={{ px: 3, py: 2 }}>
        {hasGenerated ? (
          <Button variant="contained" onClick={onClose}>
            Tutup
          </Button>
        ) : (
          <>
            <Button variant="outlined" onClick={onClose}>
              Batal
            </Button>
            <Button variant="contained" onClick={onSubmit} disabled={submitting}>
              {submitting ? "Menyimpan..." : "Generate QR"}
            </Button>
          </>
        )}
      </DialogActions>
    </Dialog>
  );
}

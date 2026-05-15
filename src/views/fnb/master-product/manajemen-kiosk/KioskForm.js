"use client";

import React from "react";
import useSWR from "swr";
import { useFormik, FormikProvider, Form } from "formik";
import * as Yup from "yup";
import { useRouter } from "next/navigation";
import {
  Alert,
  Box,
  Button,
  Divider,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControlLabel,
  IconButton,
  Paper,
  Switch,
  TextField,
  Typography,
} from "@mui/material";
import ContentCopyRoundedIcon from "@mui/icons-material/ContentCopyRounded";
import { fnbMerchantKiosk } from "@/core/services/api_fnb";
import { getApiErrorMessage, showErrorToast, showSuccessToast, toastPromise } from "@/shared/utils/toast";

const labelSx = {
  color: "#374151",
  fontSize: "0.875rem",
  fontWeight: 500,
};

function ApiKeyReveal({ apiKey }) {
  const [copied, setCopied] = React.useState(false);

  if (!apiKey) return null;

  return (
    <Alert
      severity="success"
      sx={{
        mb: 0,
        alignItems: "flex-start",
        border: "1px solid #86efac",
        bgcolor: "#f0fdf4",
        borderRadius: 2,
        py: 1,
        px: 1.5,
        "& .MuiAlert-icon": { py: 0.25, color: "#059669" },
        "& .MuiAlert-message": { width: "100%", py: 0.25 },
      }}
    >
      <Typography sx={{ fontWeight: 800, mb: 0.35, color: "#166534" }}>API Key</Typography>
      <Box sx={{ display: "flex", alignItems: "center", gap: 0.75, maxWidth: "100%" }}>
        <Box sx={{ minWidth: 0, display: "flex", alignItems: "center", gap: 0.5 }}>
          <Typography
            sx={{
              fontFamily: "monospace",
              wordBreak: "break-all",
              color: "#14532d",
              fontSize: "0.92rem",
              lineHeight: 1.45,
            }}
          >
            {apiKey}
          </Typography>
          <IconButton
            size="small"
            onClick={async () => {
              try {
                await navigator.clipboard.writeText(apiKey);
                setCopied(true);
                setTimeout(() => setCopied(false), 1200);
                showSuccessToast("API key berhasil disalin.");
              } catch (error) {
                showErrorToast(getApiErrorMessage(error, "Gagal menyalin API key."));
              }
            }}
            sx={{
              flexShrink: 0,
              color: copied ? "#047857" : "#15803d",
              border: "1px solid #86efac",
              bgcolor: "#ecfdf5",
              "&:hover": { bgcolor: "#d1fae5" },
            }}
          >
            <ContentCopyRoundedIcon sx={{ fontSize: 16 }} />
          </IconButton>
        </Box>
      </Box>
      <Typography
        sx={{
          fontSize: "0.86rem",
          mt: 0.75,
          color: "#166534",
          fontWeight: 700,
          lineHeight: 1.45,
          bgcolor: "#dcfce7",
          border: "1px solid #86efac",
          borderRadius: 1.5,
          px: 1,
          py: 0.75,
          display: "block",
          width: "100%",
        }}
      >
        API key hanya tampil sekali. Simpan sekarang sebelum keluar dari halaman ini.
      </Typography>
    </Alert>
  );
}

function ApiKeyDialog({ open, apiKey, onBackToList }) {
  return (
    <Dialog open={open} onClose={onBackToList} fullWidth maxWidth="md">
      <DialogTitle sx={{ px: 3, py: 1.5, fontWeight: 500, fontSize: "1rem" }}>
        <Typography sx={{ fontSize: "1rem", fontWeight: 500, color: "#1f2937" }}>API Key Kiosk</Typography>
      </DialogTitle>
      <Divider />
      <DialogContent sx={{ px: 3, py: 3 }}>
        <ApiKeyReveal apiKey={apiKey} />
      </DialogContent>
      <DialogActions sx={{ px: 3, py: 2.5 }}>
        <Button variant="contained" onClick={onBackToList} sx={{ textTransform: "none" }}>
          Kembali
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default function KioskForm({ mode = "create", kioskId }) {
  const router = useRouter();
  const isEdit = mode === "edit";
  const [generatedApiKey, setGeneratedApiKey] = React.useState("");
  const [apiKeyDialogOpen, setApiKeyDialogOpen] = React.useState(false);
  const [isRotating, setIsRotating] = React.useState(false);
  const [isTogglingActive, setIsTogglingActive] = React.useState(false);
  const isCreateLocked = !isEdit && Boolean(generatedApiKey);

  const { data: detailResponse, error: detailError } = useSWR(
    isEdit && kioskId ? ["fnb-kiosk-detail-edit", kioskId] : null,
    () => fnbMerchantKiosk.getById(kioskId),
    { revalidateOnFocus: false, shouldRetryOnError: false }
  );

  React.useEffect(() => {
    if (detailError) showErrorToast(getApiErrorMessage(detailError, "Gagal memuat detail kiosk."));
  }, [detailError]);

  const kioskDetail = detailResponse?.data || {};

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      deviceCode: kioskDetail?.deviceCode || "",
      deviceName: kioskDetail?.deviceName || "",
      isActive: typeof kioskDetail?.isActive === "boolean" ? kioskDetail.isActive : true,
    },
    validationSchema: Yup.object({
      deviceCode: Yup.string().trim().required("Device code wajib diisi."),
      deviceName: Yup.string().trim().required("Device name wajib diisi."),
      isActive: Yup.boolean().required(),
    }),
    onSubmit: async (values) => {
      const payload = isEdit
        ? {
          deviceName: values.deviceName.trim(),
        }
        : {
          deviceCode: values.deviceCode.trim(),
          deviceName: values.deviceName.trim(),
        };

      const submitPromise = isEdit
        ? fnbMerchantKiosk.update(kioskId, payload)
        : fnbMerchantKiosk.create(payload);

      const response = await toastPromise(submitPromise, {
        loading: isEdit ? "Menyimpan kiosk..." : "Membuat kiosk...",
        success: isEdit ? "Kiosk berhasil diperbarui." : "Kiosk berhasil dibuat.",
        error: (error) => getApiErrorMessage(error, isEdit ? "Gagal menyimpan kiosk." : "Gagal membuat kiosk."),
      });

      const apiKey = response?.data?.apiKey;
      if (apiKey) {
        setGeneratedApiKey(apiKey);
        setApiKeyDialogOpen(true);
        return;
      }

      router.push("/fnb/master-product/manajemen-kiosk");
    },
  });

  const handleToggleActive = React.useCallback(async (_, nextChecked) => {
    if (!kioskId) return;

    setIsTogglingActive(true);
    try {
      await toastPromise(nextChecked ? fnbMerchantKiosk.activate(kioskId) : fnbMerchantKiosk.revoke(kioskId), {
        loading: nextChecked ? "Mengaktifkan kiosk..." : "Menonaktifkan kiosk...",
        success: nextChecked ? "Kiosk berhasil diaktifkan." : "Kiosk berhasil dinonaktifkan.",
        error: (error) => getApiErrorMessage(error, nextChecked ? "Gagal mengaktifkan kiosk." : "Gagal menonaktifkan kiosk."),
      });
      formik.setFieldValue("isActive", nextChecked, false);
    } finally {
      setIsTogglingActive(false);
    }
  }, [formik, kioskId]);

  const handleRotateApiKey = React.useCallback(async () => {
    if (!kioskId) return;
    setIsRotating(true);
    try {
      const response = await toastPromise(fnbMerchantKiosk.rotateApiKey(kioskId), {
        loading: "Membuat API key baru...",
        success: "API key baru berhasil dibuat.",
        error: (error) => getApiErrorMessage(error, "Gagal membuat API key baru."),
      });
      const apiKey = response?.data?.apiKey;
      if (apiKey) {
        setGeneratedApiKey(apiKey);
        setApiKeyDialogOpen(true);
      }
    } finally {
      setIsRotating(false);
    }
  }, [kioskId]);

  return (
    <FormikProvider value={formik}>
      <Form>
        <Box sx={{ display: "grid", gap: 1.5 }}>
          <Paper elevation={0} sx={{ borderRadius: 3, border: "1px solid #e5e7eb", p: { xs: 2, md: 3 }, bgcolor: "#fcfdff" }}>
            <Box sx={{ display: "grid", gap: 1.25 }}>
              <Box>
                <Typography sx={{ ...labelSx, mb: 1 }}>Device Code</Typography>
                <TextField
                  fullWidth
                  required
                  size="small"
                  value={formik.values.deviceCode}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  name="deviceCode"
                  placeholder="Masukkan device code"
                  disabled={isEdit || isCreateLocked}
                  error={Boolean(formik.touched.deviceCode && formik.errors.deviceCode)}
                  helperText={formik.touched.deviceCode && formik.errors.deviceCode ? formik.errors.deviceCode : ""}
                />
              </Box>
              <Box>
                <Typography sx={{ ...labelSx, mb: 1 }}>Device Name</Typography>
                <TextField
                  fullWidth
                  required
                  size="small"
                  value={formik.values.deviceName}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  name="deviceName"
                  placeholder="Masukkan device name"
                  disabled={isCreateLocked}
                  error={Boolean(formik.touched.deviceName && formik.errors.deviceName)}
                  helperText={formik.touched.deviceName && formik.errors.deviceName ? formik.errors.deviceName : ""}
                />
              </Box>
              {isEdit ? (
                <Box>
                  <Typography sx={{ ...labelSx, mb: 0.5 }}>Status Kiosk</Typography>
                  <FormControlLabel
                    sx={{ m: 0 }}
                    control={
                      <Switch
                        checked={Boolean(formik.values.isActive)}
                        onChange={handleToggleActive}
                        disabled={isTogglingActive || formik.isSubmitting}
                        sx={{
                          "& .MuiSwitch-switchBase.Mui-checked": { color: "#155DFC" },
                          "& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track": { backgroundColor: "#155DFC" },
                        }}
                      />
                    }
                    label=""
                  />
                  {isTogglingActive ? (
                    <Typography sx={{ color: "#6b7280", fontSize: "0.75rem", mt: 0.25 }}>Memproses...</Typography>
                  ) : null}
                </Box>
              ) : null}
            </Box>

            {isEdit ? (
              <>
                <Divider sx={{ my: 2.5 }} />
                <Box sx={{ display: "flex", justifyContent: "space-between", gap: 1.5, flexWrap: "wrap" }}>
                  <Button type="button" variant="outlined" onClick={handleRotateApiKey} disabled={isRotating || formik.isSubmitting}>
                    {isRotating ? "Generating..." : "Generate API Key"}
                  </Button>
                  <Typography sx={{ color: "#6b7280", fontSize: "0.8rem", alignSelf: "center" }}>
                    API key baru akan menggantikan yang lama.
                  </Typography>
                </Box>
              </>
            ) : null}

            <Divider sx={{ my: 2.5 }} />

            <Box sx={{ display: "flex", gap: 1.5, justifyContent: "flex-end" }}>
              <Button type="button" variant="outlined" onClick={() => router.push("/fnb/master-product/manajemen-kiosk")}>
                Cancel
              </Button>
              <Button type="submit" variant="contained" disabled={formik.isSubmitting || isCreateLocked}>
                {formik.isSubmitting ? "Saving..." : "Save"}
              </Button>
            </Box>
          </Paper>
        </Box>
        <ApiKeyDialog
          open={apiKeyDialogOpen && Boolean(generatedApiKey)}
          apiKey={generatedApiKey}
          onBackToList={() => {
            setApiKeyDialogOpen(false);
            router.push("/fnb/master-product/manajemen-kiosk");
          }}
        />
      </Form>
    </FormikProvider>
  );
}

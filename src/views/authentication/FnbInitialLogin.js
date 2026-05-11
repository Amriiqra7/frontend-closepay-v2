'use client';

import React from "react";
import { useRouter } from "next/navigation";
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  Paper,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { authentication } from "@/core/services/api_auth";
import { getApiErrorMessage, showErrorToast } from "@/shared/utils/toast";

const FNB_LOGIN_CONTEXT_KEY = "closepay.fnb.login-context";

const adminInputSx = {
  "& .MuiOutlinedInput-root": {
    borderRadius: "10px",
    "& .MuiOutlinedInput-input": {
      fontSize: "0.875rem",
    },
  },
  "& .MuiInputLabel-root": {
    fontSize: "0.875rem",
  },
};

const fieldLabelSx = {
  color: "#374151",
  fontSize: "0.875rem",
  fontWeight: 600,
};

export default function FnbInitialLogin() {
  const router = useRouter();
  const [initial, setInitial] = React.useState("");
  const [loading, setLoading] = React.useState(false);
  const [company, setCompany] = React.useState(null);

  const handleLookup = async () => {
    const normalizedInitial = String(initial || "").trim().toUpperCase();
    if (!normalizedInitial) return;

    setLoading(true);
    try {
      const response = await authentication.getMerchantCompanyByInitial(normalizedInitial);
      const companyData = response?.data || null;

      if (!companyData?._id) {
        throw new Error("Company tidak ditemukan");
      }

      setCompany({
        id: companyData._id,
        name: companyData.name || "-",
        initial: normalizedInitial,
      });
    } catch (error) {
      setCompany(null);
      showErrorToast(getApiErrorMessage(error, "Gagal mengambil data company"));
    } finally {
      setLoading(false);
    }
  };

  const handleConfirm = () => {
    if (!company?.id) return;
    if (typeof window !== "undefined") {
      window.sessionStorage.setItem(
        FNB_LOGIN_CONTEXT_KEY,
        JSON.stringify({
          companyId: company.id,
          initial: company.initial,
          companyName: company.name,
          savedAt: new Date().toISOString(),
        })
      );
    }
    router.push("/fnb/login");
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        bgcolor: "#f5f7fb",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        p: 2,
      }}
    >
      <Paper elevation={0} sx={{ width: "100%", maxWidth: 520, borderRadius: 4, p: 1 }}>
        <Card elevation={0} sx={{ borderRadius: 4 }}>
          <CardContent sx={{ p: { xs: 2.5, sm: 3.5 } }}>
            <Typography sx={{ color: "#111827", fontWeight: 800, fontSize: "1.4rem" }}>
              Initial Company FNB
            </Typography>
            <Typography sx={{ mt: 0.8, color: "#6b7280", fontSize: "0.875rem" }}>
              Masukkan initial perusahaan terlebih dahulu untuk lanjut ke login FNB.
            </Typography>

            <Stack component="form" onSubmit={(event) => {
              event.preventDefault();
              if (company) {
                handleConfirm();
              } else {
                handleLookup();
              }
            }} spacing={2} sx={{ mt: 2.25 }}>
              <Stack spacing={0.75}>
                <Typography sx={fieldLabelSx}>Initial</Typography>
                <TextField
                  placeholder="Contoh: QA"
                  fullWidth
                  size="small"
                  value={initial}
                  onChange={(event) => setInitial(event.target.value.toUpperCase())}
                  sx={adminInputSx}
                  slotProps={{
                    htmlInput: {
                      suppressHydrationWarning: true,
                    },
                  }}
                />
              </Stack>

              {company ? (
                <Alert severity="success" sx={{ borderRadius: 3 }}>
                  Company ditemukan: <strong>{company.name}</strong>
                </Alert>
              ) : null}

              <Button
                variant="contained"
                type="submit"
                onClick={company ? handleConfirm : handleLookup}
                disabled={loading || !String(initial || "").trim()}
                sx={{ py: 1, borderRadius: 1, fontWeight: 600, textTransform: "none" }}
              >
                {loading ? "Memproses..." : company ? "Konfirmasi & Lanjut Login" : "Selanjutnya"}
              </Button>
            </Stack>
          </CardContent>
        </Card>
      </Paper>
    </Box>
  );
}

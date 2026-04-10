'use client';

import React, { memo, useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import {
  Alert,
  Avatar,
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Link,
  Paper,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { authentication } from "@/core/services/api_auth";
import {
  createPkceBundle,
  getOrCreateDeviceId,
  getOrCreateNonce,
  hashCaptchaValue,
  saveAuthSession,
  saveDeviceAuthSession,
  saveDeviceChallenge,
  savePkceBundle,
} from "@/core/services/authSession";
import { showErrorToast, showSuccessToast } from "@/shared/utils/toast";

const getPrefixValue = (prefix) => {
  const normalizedPrefix = typeof prefix === "string" ? prefix.trim() : "";
  return normalizedPrefix || " ";
};

const getErrorPayload = (error) => error?.response?.data?.detail || error?.detail || {};

function Logo() {
  return (
    <Box display="flex" justifyContent="center" mb={2}>
      <Avatar
        src="/assets/images/auth/logo.png"
        alt="Logo"
        sx={{ width: 80, height: 80, bgcolor: "transparent" }}
        variant="square"
      />
    </Box>
  );
}

const CaptchaDialog = memo(function CaptchaDialog({
  open,
  challenge,
  captchaValue,
  onCaptchaChange,
  onVerify,
}) {
  const captchaImage = challenge?.captcha?.data?.captchaImage;
  const captchaMime = challenge?.captcha?.data?.captchaMime || "image/png";

  return (
    <Dialog
      open={open}
      fullWidth
      maxWidth="sm"
      disableEscapeKeyDown
      onClose={(event, reason) => {
        if (reason === "backdropClick" || reason === "escapeKeyDown") {
          return;
        }
      }}
      slotProps={{
        backdrop: {
          sx: {
            backdropFilter: "blur(4px)",
            bgcolor: "rgba(15, 23, 42, 0.56)",
          },
        },
      }}
      PaperProps={{
        sx: {
          borderRadius: 4,
          p: 1,
        },
      }}
    >
      <DialogTitle sx={{ pb: 1, fontWeight: 700 }}>Verifikasi Captcha</DialogTitle>
      <DialogContent>
        <Stack spacing={2.5}>
          <Alert severity="warning" sx={{ borderRadius: 3 }}>
            Perangkat belum terdaftar. Selesaikan captcha terlebih dahulu untuk melanjutkan proses registrasi perangkat.
          </Alert>

          <Box
            sx={{
              borderRadius: 4,
              border: "1px solid",
              borderColor: "divider",
              bgcolor: "#fafafa",
              p: 2,
            }}
          >
            <Typography variant="body2" color="text.secondary" mb={1}>
              Status
            </Typography>
            <Typography variant="subtitle1" fontWeight={700}>
              {challenge?.message || "Perangkat belum terdaftar"}
            </Typography>
            {challenge?.additionalData?.userType ? (
              <Stack direction="row" spacing={1} sx={{ mt: 1.5, flexWrap: "wrap" }}>
                <Chip
                  label={`User Type: ${challenge.additionalData.userType}`}
                  size="small"
                />
              </Stack>
            ) : null}
          </Box>

          {challenge?.captchaLoading ? (
            <Box
              sx={{
                minHeight: 140,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                borderRadius: 4,
                border: "1px solid",
                borderColor: "divider",
                bgcolor: "#fafafa",
              }}
            >
              <Stack spacing={1.5} alignItems="center">
                <CircularProgress size={28} />
                <Typography variant="body2" color="text.secondary">
                  Meminta captcha perangkat...
                </Typography>
              </Stack>
            </Box>
          ) : null}

          {!challenge?.captchaLoading && captchaImage ? (
            <Box
              sx={{
                borderRadius: 4,
                border: "1px solid",
                borderColor: "divider",
                bgcolor: "#fff",
                p: 2,
                display: "flex",
                justifyContent: "center",
              }}
            >
              <Box
                component="img"
                src={`data:${captchaMime};base64,${captchaImage}`}
                alt="Captcha perangkat"
                sx={{ maxWidth: "100%", height: "auto", borderRadius: 2 }}
              />
            </Box>
          ) : null}

          {!challenge?.captchaLoading && challenge?.captchaError ? (
            <Alert severity="error" sx={{ borderRadius: 3 }}>
              {challenge.captchaError}
            </Alert>
          ) : null}

          {!challenge?.captchaLoading && captchaImage ? (
            <TextField
              label="Masukkan captcha"
              fullWidth
              value={captchaValue}
              onChange={(event) => onCaptchaChange(event.target.value)}
              InputProps={{ sx: { borderRadius: 3 } }}
            />
          ) : null}

          <Typography variant="caption" color="text.secondary" textAlign="center">
            Popup ini sengaja tidak bisa ditutup sampai alur verifikasi perangkat diselesaikan.
          </Typography>

          {!challenge?.captchaLoading && captchaImage ? (
            <Button
              variant="contained"
              fullWidth
              onClick={onVerify}
              disabled={!captchaValue.trim() || challenge?.verifyLoading}
              sx={{ py: 1.4, borderRadius: 3, fontWeight: 700 }}
            >
              {challenge?.verifyLoading ? "Memverifikasi captcha..." : "Kirim Captcha"}
            </Button>
          ) : null}
        </Stack>
      </DialogContent>
    </Dialog>
  );
});

const OtpDialog = memo(function OtpDialog({ open, email }) {
  return (
    <Dialog
      open={open}
      fullWidth
      maxWidth="sm"
      disableEscapeKeyDown
      onClose={(event, reason) => {
        if (reason === "backdropClick" || reason === "escapeKeyDown") {
          return;
        }
      }}
      PaperProps={{ sx: { borderRadius: 4 } }}
    >
      <DialogTitle sx={{ fontWeight: 700 }}>Verifikasi OTP</DialogTitle>
      <DialogContent>
        <Stack spacing={2}>
          <Alert severity="success" sx={{ borderRadius: 3 }}>
            Captcha berhasil diverifikasi.
          </Alert>
          <Typography variant="body2" color="text.secondary">
            Langkah berikutnya adalah verifikasi OTP{email ? ` untuk ${email}` : ""}.
          </Typography>
        </Stack>
      </DialogContent>
      <DialogActions sx={{ px: 3, pb: 3 }}>
        <Button variant="contained" fullWidth sx={{ borderRadius: 3, py: 1.2 }}>
          Lanjutkan OTP
        </Button>
      </DialogActions>
    </Dialog>
  );
});

function LoginForm({ prefix }) {
  const router = useRouter();
  const [deviceId, setDeviceId] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [captchaOpen, setCaptchaOpen] = useState(false);
  const [captchaChallenge, setCaptchaChallenge] = useState(null);
  const [captchaValue, setCaptchaValue] = useState("");
  const [otpOpen, setOtpOpen] = useState(false);
  const [otpEmail, setOtpEmail] = useState("");
  const [formValues, setFormValues] = useState({
    username: "",
    password: "",
  });
  const requestedCaptchaKeyRef = useRef("");

  const effectivePrefix = useMemo(() => getPrefixValue(prefix), [prefix]);

  useEffect(() => {
    setDeviceId(getOrCreateDeviceId());
  }, []);

  useEffect(() => {
    const accessToken = captchaChallenge?.additionalData?.access_token;
    const codeChallenge = captchaChallenge?.pkce?.codeChallenge;
    const timestamp = captchaChallenge?.pkce?.timestamp;

    if (!captchaOpen || !accessToken || !codeChallenge || !timestamp) {
      return;
    }

    const requestKey = `${accessToken}:${codeChallenge}:${timestamp}`;
    if (requestedCaptchaKeyRef.current === requestKey) {
      return;
    }
    requestedCaptchaKeyRef.current = requestKey;

    let isActive = true;

    const requestCaptcha = async () => {
      setCaptchaChallenge((prev) =>
        prev
          ? {
              ...prev,
              captchaLoading: true,
              captchaError: "",
            }
          : prev
      );

      try {
        const captchaResponse = await authentication.requestCaptcha({
          accessToken,
          codeChallenge,
          timestamp,
        });

        if (!isActive) return;

        setCaptchaChallenge((prev) =>
          prev
            ? {
                ...prev,
                captcha: captchaResponse,
                captchaLoading: false,
                captchaError: "",
              }
            : prev
        );
      } catch (error) {
        if (!isActive) return;

        setCaptchaChallenge((prev) =>
          prev
            ? {
                ...prev,
                captchaLoading: false,
                captchaError:
                  error?.response?.data?.message ||
                  error?.response?.data?.detail?.message ||
                  error?.message ||
                  "Gagal meminta captcha perangkat",
              }
            : prev
        );
      }
    };

    requestCaptcha();

    return () => {
      isActive = false;
    };
  }, [
    captchaOpen,
    captchaChallenge?.additionalData?.access_token,
    captchaChallenge?.pkce?.codeChallenge,
    captchaChallenge?.pkce?.timestamp,
  ]);

  const handleSubmit = async (event) => {
    event.preventDefault();

    const currentDeviceId = deviceId || getOrCreateDeviceId();
    const pkceBundle = await createPkceBundle();
    savePkceBundle(pkceBundle);
    const requestBody = {
      prefix: effectivePrefix,
      nonce: getOrCreateNonce(10),
      deviceId: currentDeviceId,
    };
    const payload = {
      username: formValues.username,
      password: formValues.password,
      ...requestBody,
    };

    setIsSubmitting(true);

    try {
      const response = await authentication.login(payload);
      saveAuthSession(response);
      setCaptchaOpen(false);
      setCaptchaChallenge(null);
      setCaptchaValue("");
      requestedCaptchaKeyRef.current = "";
      showSuccessToast(response?.message || "Login berhasil");
      router.push("/dashboard");
    } catch (error) {
      const detail = getErrorPayload(error);

      if (detail?.type === "UNREGISTERED_DEVICE") {
        saveDeviceAuthSession(detail?.additionalData);

        const challengePayload = {
          ...detail,
          request: requestBody,
          pkce: pkceBundle,
          captcha: null,
          captchaLoading: false,
          captchaError: "",
        };

        saveDeviceChallenge(challengePayload);
        setCaptchaChallenge(challengePayload);
        setCaptchaValue("");
        setCaptchaOpen(true);
        return;
      }

      showErrorToast(detail?.message || error?.message || "Login gagal");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleVerifyCaptcha = async () => {
    const accessToken = captchaChallenge?.additionalData?.access_token;
    if (!accessToken || !captchaValue.trim()) {
      return;
    }

    const verifyPkceBundle = await createPkceBundle();
    savePkceBundle(verifyPkceBundle);
    const captchaHashedValue = await hashCaptchaValue(captchaValue.trim());

    setCaptchaChallenge((prev) =>
      prev
        ? {
            ...prev,
            verifyLoading: true,
            captchaError: "",
            verifyPkce: verifyPkceBundle,
          }
        : prev
    );

    try {
      await authentication.verifyCaptcha({
        accessToken,
        captchaHashedValue,
        codeVerifier: verifyPkceBundle.codeVerifier,
        email: formValues.username,
        codeChallenge: verifyPkceBundle.codeChallenge,
        timestamp: verifyPkceBundle.timestamp,
      });

      setCaptchaOpen(false);
      setOtpEmail(formValues.username);
      setOtpOpen(true);
      setCaptchaValue("");
    } catch (error) {
      setCaptchaChallenge((prev) =>
        prev
          ? {
              ...prev,
              verifyLoading: false,
              captchaError:
                error?.response?.data?.message ||
                error?.response?.data?.detail?.message ||
                error?.message ||
                "Gagal memverifikasi captcha",
            }
          : prev
      );
    }
  };

  return (
    <>
      <Card elevation={0} sx={{ p: { xs: 2, sm: 4 }, borderRadius: 4, boxShadow: 0, width: "100%" }}>
        <CardContent>
          <Logo />
          <Typography
            variant="h4"
            fontWeight={600}
            align="center"
            mb={1}
            sx={{ fontSize: { xs: "1.75rem", sm: "2.125rem" } }}
          >
            Login
          </Typography>
          <Typography
            variant="body2"
            align="center"
            color="text.secondary"
            mb={3}
            sx={{ fontSize: { xs: "0.8rem", sm: "0.875rem" } }}
          >
            Masukkan username/email dan password Anda untuk masuk ke dashboard
          </Typography>

          <Box component="form" noValidate autoComplete="off" onSubmit={handleSubmit}>
            <TextField
              label="Username"
              variant="outlined"
              fullWidth
              margin="normal"
              value={formValues.username}
              onChange={(event) =>
                setFormValues((prev) => ({
                  ...prev,
                  username: event.target.value,
                }))
              }
              InputProps={{ sx: { borderRadius: 4 } }}
            />
            <TextField
              label="Password"
              type="password"
              variant="outlined"
              fullWidth
              margin="normal"
              value={formValues.password}
              onChange={(event) =>
                setFormValues((prev) => ({
                  ...prev,
                  password: event.target.value,
                }))
              }
              InputProps={{ sx: { borderRadius: 4 } }}
            />
            <Button
              type="submit"
              variant="contained"
              fullWidth
              disabled={isSubmitting || !deviceId}
              sx={{
                mt: 1,
                mb: 2,
                py: 1.5,
                fontWeight: 600,
                borderRadius: 4,
                bgcolor: "#111",
                "&:hover": { bgcolor: "#222" },
              }}
            >
              {isSubmitting ? "Memproses login..." : "Masuk"}
            </Button>
          </Box>
          <Box textAlign="center" mt={3}>
            <Link href="#" underline="hover" color="text.secondary" fontSize={16}>
              Lupa Password
            </Link>
          </Box>
        </CardContent>
      </Card>

      <CaptchaDialog
        open={captchaOpen}
        challenge={captchaChallenge}
        captchaValue={captchaValue}
        onCaptchaChange={setCaptchaValue}
        onVerify={handleVerifyCaptcha}
      />
      <OtpDialog open={otpOpen} email={otpEmail} />
    </>
  );
}

export default function Login({ initialPrefix = "" }) {
  return (
    <Box
      sx={{
        minHeight: "100vh",
        bgcolor: "#f7f7f7",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        p: 2,
      }}
    >
      <Paper
        elevation={0}
        sx={{
          width: "100%",
          maxWidth: 1100,
          minHeight: { xs: "auto", md: 650 },
          borderRadius: 4,
          display: "flex",
          flexDirection: { xs: "column", md: "row" },
          overflow: "hidden",
        }}
      >
        <Box
          sx={{
            flex: 1,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            width: "100%",
            py: { xs: 3, md: 0 },
          }}
        >
          <LoginForm prefix={initialPrefix} />
        </Box>
        <Box
          sx={{
            flex: 1,
            minHeight: { xs: 200, md: "100%" },
            display: { xs: "none", md: "flex" },
            alignItems: "center",
            justifyContent: "center",
            bgcolor: "#111",
            position: "relative",
          }}
        >
          <Box
            sx={{
              width: "90%",
              height: "90%",
              position: "relative",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Image
              src="/assets/images/bg-login.png"
              alt="Login Illustration"
              fill
              sizes="(max-width: 768px) 100vw, 50vw"
              style={{ objectFit: "contain", borderRadius: 16 }}
              priority
            />
          </Box>
        </Box>
      </Paper>
    </Box>
  );
}

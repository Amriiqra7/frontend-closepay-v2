'use client';

import React, { memo, useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";
import OtpInput from "react-otp-input";
import { useRouter } from "next/navigation";
import { Refresh2 } from "iconsax-react";
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
  IconButton,
  Link,
  Paper,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { authentication } from "@/core/services/api_auth";
import {
  clearCaptchaTimer,
  clearDeviceAuthSession,
  clearDeviceChallenge,
  clearOtpContext,
  clearPkceBundle,
  createCodeChallengeFromVerifier,
  createPkceVerifierFromTimestamp,
  createPkceBundle,
  getCaptchaTimer,
  getOtpContext,
  getOrCreateDeviceId,
  getOrCreateNonce,
  hashOtpValue,
  hashCaptchaValueWithStrategy,
  normalizeOtpPrefix,
  normalizeOtpSuffix,
  saveAuthSession,
  saveCaptchaTimer,
  saveDeviceAuthSession,
  saveDeviceChallenge,
  saveOtpContext,
  savePkceBundle,
} from "@/core/services/authSession";
import { showErrorToast, showSuccessToast } from "@/shared/utils/toast";

const getPrefixValue = (prefix) => {
  const normalizedPrefix = typeof prefix === "string" ? prefix.trim() : "";
  return normalizedPrefix || " ";
};

const getErrorPayload = (error) => error?.response?.data?.detail || error?.detail || {};
const formatCountdown = (seconds) => {
  const safeSeconds = Math.max(0, seconds);
  const minutes = String(Math.floor(safeSeconds / 60)).padStart(2, "0");
  const remainingSeconds = String(safeSeconds % 60).padStart(2, "0");

  return `${minutes}:${remainingSeconds}`;
};

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
  emailValue,
  captchaValue,
  captchaExpiresIn,
  onEmailChange,
  onCaptchaChange,
  onRefresh,
  onVerify,
}) {
  const captchaImage = challenge?.captcha?.data?.captchaImage;
  const captchaMime = challenge?.captcha?.data?.captchaMime || "image/png";
  const captchaImageSrc = useMemo(
    () =>
      captchaImage ? `data:${captchaMime};base64,${captchaImage}` : "",
    [captchaImage, captchaMime]
  );

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
                src={captchaImageSrc}
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
            <Stack direction="row" justifyContent="space-between" alignItems="center">
              <Typography variant="body2" color="text.secondary">
                Captcha kadaluarsa dalam
              </Typography>
              <Stack direction="row" spacing={1} alignItems="center">
                <Chip
                  label={formatCountdown(captchaExpiresIn)}
                  color={captchaExpiresIn <= 30 ? "warning" : "default"}
                  sx={{ fontWeight: 700 }}
                />
                <IconButton
                  onClick={onRefresh}
                  disabled={challenge?.refreshLoading}
                  sx={{
                    border: "1px solid",
                    borderColor: "divider",
                    borderRadius: 2.5,
                    width: 40,
                    height: 40,
                  }}
                >
                  <Refresh2
                    size={18}
                    variant="Linear"
                    color={challenge?.refreshLoading ? "#9ca3af" : "#111827"}
                  />
                </IconButton>
              </Stack>
            </Stack>
          ) : null}

          {!challenge?.captchaLoading && captchaImage ? (
            <TextField
              label="Email"
              fullWidth
              type="email"
              value={emailValue}
              onChange={(event) => onEmailChange(event.target.value)}
              InputProps={{ sx: { borderRadius: 3 } }}
            />
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
              disabled={!captchaValue.trim() || !emailValue.trim() || challenge?.verifyLoading}
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

const OtpDialog = memo(function OtpDialog({
  open,
  email,
  otpPrefix,
  otpValue,
  otpExpiresIn,
  otpError,
  otpLoading,
  onOtpChange,
  onVerify,
}) {
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
        <Stack spacing={2.5}>
          <Typography variant="body2" color="text.secondary">
            Langkah berikutnya adalah verifikasi OTP{email ? ` untuk ${email}` : ""}.
          </Typography>
          <Box
            sx={{
              p: 2.5,
              borderRadius: 4,
              background: "#f8fafc",
              border: "1px solid #e5e7eb",
              color: "#111827",
            }}
          >
            <Stack spacing={1}>
              <Typography
                variant="overline"
                sx={{ opacity: 0.75, letterSpacing: 1.4, color: "#4b5563" }}
              >
                Kode OTP
              </Typography>
              <Stack
                direction={{ xs: "column", sm: "row" }}
                spacing={1.5}
                alignItems={{ xs: "stretch", sm: "center" }}
              >
                <Box
                  sx={{
                    px: 2,
                    py: 1.6,
                    borderRadius: 3,
                    bgcolor: "#ffffff",
                    border: "1px solid #e5e7eb",
                    fontSize: 22,
                    fontWeight: 800,
                    letterSpacing: 1.5,
                    minWidth: 88,
                    textAlign: "center",
                    color: "#111827",
                  }}
                >
                  {otpPrefix || "---"}
                </Box>
                <Box sx={{ width: "100%" }}>
                  <OtpInput
                    value={otpValue}
                    onChange={onOtpChange}
                    numInputs={6}
                    inputType="tel"
                    shouldAutoFocus
                    renderSeparator={<Box sx={{ width: 8 }} />}
                    renderInput={(props) => (
                      <input
                        {...props}
                        style={{
                          width: "100%",
                          maxWidth: 54,
                          height: 58,
                          borderRadius: 16,
                          border: "1px solid #e5e7eb",
                          background: "#ffffff",
                          color: "#111827",
                          fontSize: 24,
                          fontWeight: 700,
                          textAlign: "center",
                          outline: "none",
                        }}
                      />
                    )}
                    containerStyle={{
                      width: "100%",
                      justifyContent: "space-between",
                      gap: "8px",
                    }}
                  />
                </Box>
              </Stack>
            </Stack>
          </Box>
          <Stack direction="row" justifyContent="space-between" alignItems="center">
            <Typography variant="body2" color="text.secondary">
              OTP kadaluarsa dalam
            </Typography>
            <Chip
              label={formatCountdown(otpExpiresIn)}
              color={otpExpiresIn <= 30 ? "warning" : "default"}
              sx={{ fontWeight: 700 }}
            />
          </Stack>
          {otpError ? (
            <Alert severity="error" sx={{ borderRadius: 3 }}>
              {otpError}
            </Alert>
          ) : null}
        </Stack>
      </DialogContent>
      <DialogActions sx={{ px: 3, pb: 3 }}>
        <Button
          variant="contained"
          fullWidth
          onClick={onVerify}
          disabled={otpLoading || otpExpiresIn <= 0 || normalizeOtpSuffix(otpValue).length !== 6}
          sx={{ borderRadius: 3, py: 1.2, fontWeight: 700 }}
        >
          {otpLoading ? "Memverifikasi OTP..." : "Verify OTP"}
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
  const [captchaExpiresIn, setCaptchaExpiresIn] = useState(0);
  const [captchaEmailValue, setCaptchaEmailValue] = useState("");
  const [captchaInputValue, setCaptchaInputValue] = useState("");
  const [otpOpen, setOtpOpen] = useState(false);
  const [otpEmail, setOtpEmail] = useState("");
  const [otpValue, setOtpValue] = useState("");
  const [otpExpiresIn, setOtpExpiresIn] = useState(0);
  const [otpContext, setOtpContext] = useState(null);
  const [otpError, setOtpError] = useState("");
  const [otpLoading, setOtpLoading] = useState(false);
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
    const savedOtpContext = getOtpContext();
    if (!savedOtpContext) {
      return;
    }

    setOtpContext(savedOtpContext);
    setOtpEmail(savedOtpContext.email || "");
    setOtpExpiresIn(Number(savedOtpContext.expiresIn) || 0);
    setOtpOpen(true);
  }, []);

  useEffect(() => {
    const savedCaptchaTimer = getCaptchaTimer();
    if (!savedCaptchaTimer) {
      return;
    }

    if (savedCaptchaTimer.remainingSeconds <= 0) {
      clearCaptchaTimer();
      setCaptchaExpiresIn(0);
      return;
    }

    setCaptchaExpiresIn(savedCaptchaTimer.remainingSeconds);
  }, []);

  useEffect(() => {
    if (!otpOpen || otpExpiresIn <= 0) {
      return;
    }

    const timer = window.setInterval(() => {
      setOtpExpiresIn((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);

    return () => {
      window.clearInterval(timer);
    };
  }, [otpOpen, otpExpiresIn]);

  useEffect(() => {
    if (!captchaOpen || captchaExpiresIn <= 0) {
      if (captchaExpiresIn <= 0) {
        clearCaptchaTimer();
      }
      return;
    }

    const timer = window.setInterval(() => {
      setCaptchaExpiresIn((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);

    return () => {
      window.clearInterval(timer);
    };
  }, [captchaOpen, captchaExpiresIn]);

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
              refreshLoading: false,
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
                refreshLoading: false,
                captchaError: "",
              }
            : prev
        );
        setCaptchaInputValue("");
        const nextCaptchaExpiresIn = Number(captchaResponse?.data?.captchaExpiresIn) || 0;
        saveCaptchaTimer(nextCaptchaExpiresIn);
        setCaptchaExpiresIn(nextCaptchaExpiresIn);
      } catch (error) {
        if (!isActive) return;

        setCaptchaChallenge((prev) =>
          prev
            ? {
                ...prev,
                captchaLoading: false,
                refreshLoading: false,
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
      clearDeviceAuthSession();
      clearDeviceChallenge();
      clearPkceBundle();
      setCaptchaOpen(false);
      setCaptchaChallenge(null);
      setCaptchaExpiresIn(0);
      setCaptchaEmailValue("");
      setCaptchaInputValue("");
      clearCaptchaTimer();
      setOtpOpen(false);
      setOtpValue("");
      setOtpContext(null);
      setOtpError("");
      setOtpLoading(false);
      setOtpExpiresIn(0);
      clearOtpContext();
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
        setCaptchaExpiresIn(0);
        setCaptchaEmailValue("");
        setCaptchaInputValue("");
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
    const existingPkce = captchaChallenge?.pkce;
    const normalizedCaptchaValue = String(captchaInputValue || "").trim();
    const normalizedEmailValue = String(captchaEmailValue || "").trim();

    if (
      !accessToken ||
      !normalizedCaptchaValue ||
      !normalizedEmailValue ||
      !existingPkce?.codeVerifier
    ) {
      return;
    }

    const otpStepVerifier = createPkceVerifierFromTimestamp(
      existingPkce.timestamp,
      117
    );
    const verifyPkceBundle = {
      timestamp: existingPkce.timestamp,
      codeVerifier: existingPkce.codeVerifier,
      codeChallenge: await createCodeChallengeFromVerifier(otpStepVerifier),
      otpCodeVerifier: otpStepVerifier,
    };
    savePkceBundle(verifyPkceBundle);
    const captchaHashResult = await hashCaptchaValueWithStrategy(
      normalizedCaptchaValue,
      "trim-lowercase"
    );
    const captchaHashedValue = captchaHashResult.base64;

    setCaptchaChallenge((prev) =>
      prev
        ? {
            ...prev,
            verifyLoading: true,
            captchaError: "",
            verifyPkce: verifyPkceBundle,
            captchaHashResult,
          }
        : prev
    );

    try {
      const verifyResponse = await authentication.verifyCaptcha({
        accessToken,
        captchaHashedValue,
        codeVerifier: verifyPkceBundle.codeVerifier,
        email: normalizedEmailValue,
        codeChallenge: verifyPkceBundle.codeChallenge,
        timestamp: verifyPkceBundle.timestamp,
      });

      const otpData = verifyResponse?.data || {};

      showSuccessToast(verifyResponse?.message || "Captcha berhasil diverifikasi");
      setCaptchaOpen(false);
      setOtpEmail(normalizedEmailValue);
      setOtpValue("");
      setOtpError("");
      setOtpLoading(false);
      setCaptchaExpiresIn(0);
      setCaptchaInputValue("");
      clearCaptchaTimer();
      setOtpExpiresIn(Number(otpData?.expiresIn) || 0);
      const nextOtpContext = {
        otpRequestId: otpData?.otpRequestId || "",
        prefix: otpData?.prefix || "",
        expiresIn: Number(otpData?.expiresIn) || 0,
        debug: otpData?.debug || null,
        codeVerifier: otpStepVerifier,
        requestCodeVerifier: existingPkce.codeVerifier,
        accessToken,
        email: normalizedEmailValue,
      };
      setOtpContext(nextOtpContext);
      saveOtpContext(nextOtpContext);
      setOtpOpen(true);
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

  const handleRefreshCaptcha = async () => {
    const accessToken = captchaChallenge?.additionalData?.access_token;

    if (!accessToken) {
      return;
    }

    setCaptchaChallenge((prev) =>
      prev
        ? {
            ...prev,
            refreshLoading: true,
            captchaError: "",
          }
        : prev
    );

    try {
      const refreshedPkceBundle = await createPkceBundle();
      const captchaResponse = await authentication.refreshCaptcha({
        accessToken,
        codeChallenge: refreshedPkceBundle.codeChallenge,
        timestamp: refreshedPkceBundle.timestamp,
      });

      savePkceBundle(refreshedPkceBundle);
      requestedCaptchaKeyRef.current = `${accessToken}:${refreshedPkceBundle.codeChallenge}:${refreshedPkceBundle.timestamp}`;

      setCaptchaChallenge((prev) =>
        prev
          ? {
              ...prev,
              pkce: refreshedPkceBundle,
              captcha: captchaResponse,
              refreshLoading: false,
              captchaError: "",
            }
          : prev
      );
      setCaptchaInputValue("");
    } catch (error) {
      setCaptchaChallenge((prev) =>
        prev
          ? {
              ...prev,
              refreshLoading: false,
              captchaError:
                error?.response?.data?.message ||
                error?.response?.data?.detail?.message ||
                error?.message ||
                "Gagal memuat captcha baru",
            }
          : prev
      );
    }
  };

  const handleVerifyOtp = async () => {
    const otpPrefix = otpContext?.prefix || "";
    const debugOtp = otpContext?.debug?.otp || "";
    const normalizedOtpSuffix = normalizeOtpSuffix(otpValue);
    const normalizedOtpPrefix = normalizeOtpPrefix(otpPrefix);
    const normalizedDebugOtp = String(debugOtp || "")
      .toUpperCase();

    if (!otpContext?.accessToken || !otpContext?.codeVerifier) {
      return;
    }

    if (normalizedOtpSuffix.length !== 6) {
      setOtpError("OTP harus terdiri dari 6 karakter.");
      return;
    }

    if (otpExpiresIn <= 0) {
      setOtpError("OTP sudah kadaluarsa. Silakan ulangi proses captcha.");
      return;
    }

    if (
      debugOtp &&
      `${normalizedOtpPrefix}${normalizedOtpSuffix}` !== normalizedDebugOtp
    ) {
      setOtpError("OTP yang dimasukkan belum sesuai dengan OTP debug.");
      return;
    }

    setOtpLoading(true);
    setOtpError("");

    try {
      const otpHashResult = await hashOtpValue(otpPrefix, normalizedOtpSuffix);

      if (otpContext?.debug?.hash && otpHashResult.hashedValue !== otpContext.debug.hash) {
        console.warn("OTP hash mismatch with debug hash", {
          expected: otpContext.debug.hash,
          actual: otpHashResult.hashedValue,
          normalizedOtpValue: otpHashResult.normalizedOtpValue,
        });
      }

      const response = await authentication.verifyOtp({
        accessToken: otpContext.accessToken,
        otpValue: otpHashResult.hashedValue,
        codeVerifier: otpContext.codeVerifier,
      });

      setOtpOpen(false);
      setOtpValue("");
      setOtpContext(null);
      setOtpEmail("");
      setOtpExpiresIn(0);
      setCaptchaChallenge(null);
      clearCaptchaTimer();
      setOtpError("");
      clearOtpContext();
      showSuccessToast(response?.message || "Verifikasi OTP berhasil, silakan login kembali");
    } catch (error) {
      setOtpError(
        error?.response?.data?.message ||
          error?.response?.data?.detail?.message ||
          error?.message ||
          "Gagal memverifikasi OTP"
      );
    } finally {
      setOtpLoading(false);
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
        emailValue={captchaEmailValue}
        captchaValue={captchaInputValue}
        captchaExpiresIn={captchaExpiresIn}
        onEmailChange={setCaptchaEmailValue}
        onCaptchaChange={setCaptchaInputValue}
        onRefresh={handleRefreshCaptcha}
        onVerify={handleVerifyCaptcha}
      />
      <OtpDialog
        open={otpOpen}
        email={otpEmail}
        otpPrefix={otpContext?.prefix || ""}
        otpValue={otpValue}
        otpExpiresIn={otpExpiresIn}
        otpError={otpError}
        otpLoading={otpLoading}
        onOtpChange={setOtpValue}
        onVerify={handleVerifyOtp}
      />
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

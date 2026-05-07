'use client';

import React, { memo, useMemo, useRef, useState } from "react";
import OtpInput from "react-otp-input";
import { useRouter } from "next/navigation";
import { Refresh2 } from "iconsax-react";
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  CircularProgress,
  Dialog,
  DialogContent,
  DialogTitle,
  IconButton,
  InputAdornment,
  Paper,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { authentication } from "@/core/services/api_auth";
import {
  clearCaptchaTimer,
  clearOtpContext,
  createCodeChallengeFromVerifier,
  createPkceBundle,
  createPkceVerifierFromTimestamp,
  getCaptchaTimer,
  getOrCreateDeviceId,
  getOrCreateNonce,
  getOtpContext,
  hashCaptchaValueWithStrategy,
  hashOtpValue,
  normalizeOtpSuffix,
  saveAuthSession,
  saveCaptchaTimer,
  saveOtpContext,
  savePkceBundle,
} from "@/core/services/authSession";
import { Eye, EyeSlash } from "iconsax-react";
import { getApiErrorMessage, showErrorToast, showSuccessToast } from "@/shared/utils/toast";

const FNB_LOGIN_CONTEXT_KEY = "closepay.fnb.login-context";

const loginMainLikeInputSx = {
  "& .MuiOutlinedInput-root": {
    borderRadius: 4,
    "& .MuiOutlinedInput-input": {
      fontSize: "0.875rem",
    },
  },
  "& .MuiInputLabel-root": {
    fontSize: "0.875rem",
  },
};

const formatCountdown = (seconds) => {
  const safeSeconds = Math.max(0, seconds);
  const minutes = String(Math.floor(safeSeconds / 60)).padStart(2, "0");
  const remainingSeconds = String(safeSeconds % 60).padStart(2, "0");
  return `${minutes}:${remainingSeconds}`;
};

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
    () => (captchaImage ? `data:${captchaMime};base64,${captchaImage}` : ""),
    [captchaImage, captchaMime]
  );

  return (
    <Dialog open={open} fullWidth maxWidth="sm" disableEscapeKeyDown>
      <DialogTitle sx={{ pb: 1, fontWeight: 700 }}>Verifikasi Captcha</DialogTitle>
      <DialogContent>
        <Stack spacing={2.5}>
          <Alert severity="warning" sx={{ borderRadius: 3 }}>
            Perangkat belum terdaftar. Selesaikan captcha terlebih dahulu.
          </Alert>

          {challenge?.captchaLoading ? (
            <Box sx={{ minHeight: 140, display: "flex", alignItems: "center", justifyContent: "center" }}>
              <CircularProgress size={28} />
            </Box>
          ) : null}

          {!challenge?.captchaLoading && captchaImage ? (
            <Box sx={{ borderRadius: 2, border: "1px solid", borderColor: "divider", p: 2 }}>
              <Box component="img" src={captchaImageSrc} alt="Captcha perangkat" sx={{ maxWidth: "100%" }} />
            </Box>
          ) : null}

          {!challenge?.captchaLoading && challenge?.captchaError ? (
            <Alert severity="error" sx={{ borderRadius: 3 }}>
              {challenge.captchaError}
            </Alert>
          ) : null}

          {!challenge?.captchaLoading && captchaImage ? (
            <Stack direction="row" justifyContent="space-between" alignItems="center">
              <Chip label={formatCountdown(captchaExpiresIn)} color={captchaExpiresIn <= 30 ? "warning" : "default"} sx={{ fontWeight: 700 }} />
              <IconButton onClick={onRefresh} disabled={challenge?.refreshLoading}>
                <Refresh2 size={18} variant="Linear" color={challenge?.refreshLoading ? "#9ca3af" : "#111827"} />
              </IconButton>
            </Stack>
          ) : null}

          {!challenge?.captchaLoading && captchaImage ? (
            <TextField label="Email" fullWidth type="email" value={emailValue} onChange={(event) => onEmailChange(event.target.value)} />
          ) : null}

          {!challenge?.captchaLoading && captchaImage ? (
            <TextField label="Masukkan captcha" fullWidth value={captchaValue} onChange={(event) => onCaptchaChange(event.target.value)} />
          ) : null}

          {!challenge?.captchaLoading && captchaImage ? (
            <Button variant="contained" fullWidth onClick={onVerify} disabled={!captchaValue.trim() || !emailValue.trim() || challenge?.verifyLoading}>
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
    <Dialog open={open} fullWidth maxWidth="sm" disableEscapeKeyDown>
      <DialogTitle sx={{ fontWeight: 700 }}>Verifikasi OTP</DialogTitle>
      <DialogContent>
        <Stack spacing={2.5}>
          <Typography variant="body2" color="text.secondary">
            Lanjutkan verifikasi OTP{email ? ` untuk ${email}` : ""}.
          </Typography>
          <Stack direction="row" spacing={1.5} alignItems="center">
            <Box sx={{ px: 2, py: 1.2, borderRadius: 2, border: "1px solid #e5e7eb", fontWeight: 700 }}>
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
                      borderRadius: 12,
                      border: "1px solid #e5e7eb",
                      fontSize: 24,
                      fontWeight: 700,
                      textAlign: "center",
                    }}
                  />
                )}
                containerStyle={{ width: "100%", justifyContent: "space-between", gap: "8px" }}
              />
            </Box>
          </Stack>
          <Chip label={formatCountdown(otpExpiresIn)} color={otpExpiresIn <= 30 ? "warning" : "default"} sx={{ fontWeight: 700 }} />
          {otpError ? <Alert severity="error">{otpError}</Alert> : null}
          <Button variant="contained" fullWidth onClick={onVerify} disabled={otpLoading || otpExpiresIn <= 0 || normalizeOtpSuffix(otpValue).length !== 6}>
            {otpLoading ? "Memverifikasi OTP..." : "Verify OTP"}
          </Button>
        </Stack>
      </DialogContent>
    </Dialog>
  );
});

export default function FnbLogin() {
  const router = useRouter();
  const [loginContext, setLoginContext] = useState({ companyId: "", initial: "", companyName: "" });
  const [loading, setLoading] = useState(false);
  const [formValues, setFormValues] = useState({ username: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);

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
  const requestedCaptchaKeyRef = useRef("");

  React.useEffect(() => {
    if (typeof window === "undefined") return;
    try {
      const rawContext = window.sessionStorage.getItem(FNB_LOGIN_CONTEXT_KEY);
      if (!rawContext) return router.replace("/fnb/login/initial");
      const parsedContext = JSON.parse(rawContext);
      if (!parsedContext?.companyId) return router.replace("/fnb/login/initial");
      setLoginContext({
        companyId: parsedContext.companyId,
        initial: parsedContext.initial || "",
        companyName: parsedContext.companyName || "",
      });
    } catch {
      router.replace("/fnb/login/initial");
    }
  }, [router]);

  React.useEffect(() => {
    const savedOtpContext = getOtpContext();
    if (!savedOtpContext) return;
    setOtpContext(savedOtpContext);
    setOtpEmail(savedOtpContext.email || "");
    setOtpExpiresIn(Number(savedOtpContext.expiresIn) || 0);
    setOtpOpen(true);
  }, []);

  React.useEffect(() => {
    const savedCaptchaTimer = getCaptchaTimer();
    if (!savedCaptchaTimer) return;
    if (savedCaptchaTimer.remainingSeconds <= 0) {
      clearCaptchaTimer();
      setCaptchaExpiresIn(0);
      return;
    }
    setCaptchaExpiresIn(savedCaptchaTimer.remainingSeconds);
  }, []);

  React.useEffect(() => {
    if (!otpOpen || otpExpiresIn <= 0) return;
    const timer = window.setInterval(() => setOtpExpiresIn((prev) => (prev > 0 ? prev - 1 : 0)), 1000);
    return () => window.clearInterval(timer);
  }, [otpOpen, otpExpiresIn]);

  React.useEffect(() => {
    if (!captchaOpen || captchaExpiresIn <= 0) {
      if (captchaExpiresIn <= 0) clearCaptchaTimer();
      return;
    }
    const timer = window.setInterval(() => setCaptchaExpiresIn((prev) => (prev > 0 ? prev - 1 : 0)), 1000);
    return () => window.clearInterval(timer);
  }, [captchaOpen, captchaExpiresIn]);

  React.useEffect(() => {
    const accessToken = captchaChallenge?.additionalData?.access_token;
    const codeChallenge = captchaChallenge?.pkce?.codeChallenge;
    const timestamp = captchaChallenge?.pkce?.timestamp;
    if (!captchaOpen || !accessToken || !codeChallenge || !timestamp) return;

    const requestKey = `${accessToken}:${codeChallenge}:${timestamp}`;
    if (requestedCaptchaKeyRef.current === requestKey) return;
    requestedCaptchaKeyRef.current = requestKey;

    let isActive = true;
    const requestCaptcha = async () => {
      setCaptchaChallenge((prev) => (prev ? { ...prev, captchaLoading: true, refreshLoading: false, captchaError: "" } : prev));
      try {
        const captchaResponse = await authentication.requestMerchantCaptcha({ accessToken, codeChallenge, timestamp });
        if (!isActive) return;
        setCaptchaChallenge((prev) => (prev ? { ...prev, captcha: captchaResponse, captchaLoading: false, refreshLoading: false, captchaError: "" } : prev));
        setCaptchaInputValue("");
        const nextCaptchaExpiresIn = Number(captchaResponse?.data?.captchaExpiresIn) || 0;
        saveCaptchaTimer(nextCaptchaExpiresIn);
        setCaptchaExpiresIn(nextCaptchaExpiresIn);
      } catch (error) {
        if (!isActive) return;
        setCaptchaChallenge((prev) => (prev ? { ...prev, captchaLoading: false, refreshLoading: false, captchaError: error?.response?.data?.message || error?.response?.data?.detail?.message || error?.message || "Gagal meminta captcha perangkat" } : prev));
      }
    };
    requestCaptcha();
    return () => {
      isActive = false;
    };
  }, [captchaOpen, captchaChallenge?.additionalData?.access_token, captchaChallenge?.pkce?.codeChallenge, captchaChallenge?.pkce?.timestamp]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!loginContext.companyId) return;
    setLoading(true);
    try {
      const response = await authentication.loginMerchant({
        username: formValues.username,
        password: formValues.password,
        companyId: loginContext.companyId,
        nonce: getOrCreateNonce(10),
        deviceId: getOrCreateDeviceId(),
      });
      saveAuthSession(response);
      if (typeof window !== "undefined") window.sessionStorage.removeItem(FNB_LOGIN_CONTEXT_KEY);
      clearOtpContext();
      clearCaptchaTimer();
      showSuccessToast(response?.message || "Login FNB berhasil");
      router.push("/fnb");
    } catch (error) {
      const detail = error?.response?.data?.detail || error?.detail || {};
      if (detail?.type === "UNREGISTERED_DEVICE") {
        const pkceBundle = await createPkceBundle();
        savePkceBundle(pkceBundle);
        setCaptchaChallenge({ ...detail, pkce: pkceBundle, captcha: null, captchaLoading: false, captchaError: "" });
        setCaptchaOpen(true);
        return;
      }
      showErrorToast(getApiErrorMessage(error, "Login FNB gagal"));
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyCaptcha = async () => {
    const accessToken = captchaChallenge?.additionalData?.access_token;
    const existingPkce = captchaChallenge?.pkce;
    const normalizedCaptchaValue = String(captchaInputValue || "").trim();
    const normalizedEmailValue = String(captchaEmailValue || "").trim();
    if (!accessToken || !normalizedCaptchaValue || !normalizedEmailValue || !existingPkce?.codeVerifier) return;

    const otpStepVerifier = createPkceVerifierFromTimestamp(existingPkce.timestamp, 117);
    const verifyPkceBundle = {
      timestamp: existingPkce.timestamp,
      codeVerifier: existingPkce.codeVerifier,
      codeChallenge: await createCodeChallengeFromVerifier(otpStepVerifier),
      otpCodeVerifier: otpStepVerifier,
    };
    savePkceBundle(verifyPkceBundle);
    const captchaHashResult = await hashCaptchaValueWithStrategy(normalizedCaptchaValue, "trim-lowercase");
    const captchaHashedValue = captchaHashResult.base64;

    setCaptchaChallenge((prev) => (prev ? { ...prev, verifyLoading: true, captchaError: "" } : prev));
    try {
      const verifyResponse = await authentication.verifyMerchantCaptcha({
        accessToken,
        captchaHashedValue,
        codeVerifier: verifyPkceBundle.codeVerifier,
        email: normalizedEmailValue,
        codeChallenge: verifyPkceBundle.codeChallenge,
        timestamp: verifyPkceBundle.timestamp,
      });
      const otpData = verifyResponse?.data || {};
      setCaptchaOpen(false);
      setOtpEmail(normalizedEmailValue);
      setOtpValue("");
      setOtpError("");
      setOtpLoading(false);
      setCaptchaExpiresIn(0);
      clearCaptchaTimer();
      setOtpExpiresIn(Number(otpData?.expiresIn) || 0);
      const nextOtpContext = {
        otpRequestId: otpData?.otpRequestId || "",
        prefix: otpData?.prefix || "",
        expiresIn: Number(otpData?.expiresIn) || 0,
        debug: otpData?.debug || null,
        codeVerifier: otpStepVerifier,
        accessToken,
        email: normalizedEmailValue,
      };
      setOtpContext(nextOtpContext);
      saveOtpContext(nextOtpContext);
      setOtpOpen(true);
      showSuccessToast(verifyResponse?.message || "Captcha berhasil diverifikasi");
    } catch (error) {
      setCaptchaChallenge((prev) => (prev ? { ...prev, verifyLoading: false, captchaError: error?.response?.data?.message || error?.response?.data?.detail?.message || error?.message || "Gagal memverifikasi captcha" } : prev));
    }
  };

  const handleRefreshCaptcha = async () => {
    const accessToken = captchaChallenge?.additionalData?.access_token;
    if (!accessToken) return;
    setCaptchaChallenge((prev) => (prev ? { ...prev, refreshLoading: true, captchaError: "" } : prev));
    try {
      const refreshedPkceBundle = await createPkceBundle();
      const captchaResponse = await authentication.refreshMerchantCaptcha({
        accessToken,
        codeChallenge: refreshedPkceBundle.codeChallenge,
        timestamp: refreshedPkceBundle.timestamp,
      });
      savePkceBundle(refreshedPkceBundle);
      requestedCaptchaKeyRef.current = `${accessToken}:${refreshedPkceBundle.codeChallenge}:${refreshedPkceBundle.timestamp}`;
      setCaptchaChallenge((prev) => (prev ? { ...prev, pkce: refreshedPkceBundle, captcha: captchaResponse, refreshLoading: false, captchaError: "" } : prev));
      setCaptchaInputValue("");
    } catch (error) {
      setCaptchaChallenge((prev) => (prev ? { ...prev, refreshLoading: false, captchaError: error?.response?.data?.message || error?.response?.data?.detail?.message || error?.message || "Gagal memuat captcha baru" } : prev));
    }
  };

  const handleVerifyOtp = async () => {
    const normalizedOtpSuffix = normalizeOtpSuffix(otpValue);
    if (!otpContext?.accessToken || !otpContext?.codeVerifier) return;
    if (normalizedOtpSuffix.length !== 6) return setOtpError("OTP harus terdiri dari 6 karakter.");
    if (otpExpiresIn <= 0) return setOtpError("OTP sudah kadaluarsa. Silakan ulangi proses captcha.");

    setOtpLoading(true);
    setOtpError("");
    try {
      const otpHashResult = await hashOtpValue(otpContext?.prefix || "", normalizedOtpSuffix);
      const response = await authentication.verifyMerchantOtp({
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
      clearOtpContext();
      showSuccessToast(response?.message || "Verifikasi OTP berhasil, silakan login kembali");
    } catch (error) {
      setOtpError(error?.response?.data?.message || error?.response?.data?.detail?.message || error?.message || "Gagal memverifikasi OTP");
    } finally {
      setOtpLoading(false);
    }
  };

  return (
    <Box sx={{ minHeight: "100vh", bgcolor: "#f5f7fb", display: "flex", alignItems: "center", justifyContent: "center", p: 2 }}>
      <Paper elevation={0} sx={{ width: "100%", maxWidth: 520, borderRadius: 4, p: 1 }}>
        <Card elevation={0} sx={{ borderRadius: 4 }}>
          <CardContent sx={{ p: { xs: 2.5, sm: 3.5 } }}>
            <Typography sx={{ color: "#111827", fontWeight: 800, fontSize: "1.4rem" }}>Login FNB</Typography>
            <Typography sx={{ mt: 0.8, color: "#6b7280", fontSize: "0.875rem" }}>Masuk menggunakan username/email dan password merchant.</Typography>
            <Alert severity="info" sx={{ mt: 2, borderRadius: 3 }}>
              {loginContext.companyName ? `Company: ${loginContext.companyName}` : "Company terpilih"} {loginContext.initial ? `(${loginContext.initial})` : ""}
            </Alert>
            <Box component="form" onSubmit={handleSubmit} sx={{ mt: 1.5 }}>
              <Stack spacing={1.5}>
                <TextField
                  label="Username / Email"
                  fullWidth
                  margin="normal"
                  autoComplete="username"
                  value={formValues.username}
                  onChange={(event) => setFormValues((prev) => ({ ...prev, username: event.target.value }))}
                  sx={loginMainLikeInputSx}
                  slotProps={{
                    htmlInput: {
                      suppressHydrationWarning: true,
                    },
                  }}
                />
                <TextField
                  label="Password"
                  type={showPassword ? "text" : "password"}
                  fullWidth
                  margin="normal"
                  autoComplete="current-password"
                  value={formValues.password}
                  onChange={(event) => setFormValues((prev) => ({ ...prev, password: event.target.value }))}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton edge="end" onClick={() => setShowPassword((prev) => !prev)}>
                          {showPassword ? <EyeSlash size={18} color="black" /> : <Eye size={18} color="black" />}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                  sx={loginMainLikeInputSx}
                  slotProps={{
                    htmlInput: {
                      suppressHydrationWarning: true,
                    },
                  }}
                />
                <Stack direction="row" spacing={1.25}>
                  <Button type="button" variant="outlined" fullWidth onClick={() => router.push("/fnb/login/initial")} sx={{ py: 1, borderRadius: 1, fontWeight: 600, textTransform: "none" }}>
                    Ganti Initial
                  </Button>
                  <Button type="submit" variant="contained" fullWidth disabled={loading || !formValues.username || !formValues.password} sx={{ py: 1, borderRadius: 1, fontWeight: 600, textTransform: "none" }}>
                    {loading ? "Memproses..." : "Masuk FNB"}
                  </Button>
                </Stack>
              </Stack>
            </Box>
          </CardContent>
        </Card>
      </Paper>

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
    </Box>
  );
}

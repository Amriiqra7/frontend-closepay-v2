import MD5 from "crypto-js/md5";

const AUTH_STORAGE_KEY = "closepay.auth.session";
const DEVICE_STORAGE_KEY = "closepay.auth.device-id";
const NONCE_STORAGE_KEY = "closepay.auth.nonce";
const DEVICE_CHALLENGE_STORAGE_KEY = "closepay.auth.device-challenge";
const PKCE_STORAGE_KEY = "closepay.auth.pkce";
const DEVICE_AUTH_STORAGE_KEY = "closepay.auth.device-auth";
const OTP_CONTEXT_STORAGE_KEY = "closepay.auth.otp-context";
const CAPTCHA_TIMER_STORAGE_KEY = "closepay.auth.captcha-timer";
const NONCE_RANDOM_CHARS =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789._~-";

const isBrowser = () => typeof window !== "undefined";

const createRandomString = (length = 24) => {
    if (!isBrowser()) {
        return Math.random().toString(36).slice(2, 2 + length);
    }

    if (window.crypto?.randomUUID) {
        return window.crypto.randomUUID().replace(/-/g, "").slice(0, length);
    }

    if (!window.crypto?.getRandomValues) {
        return Math.random().toString(36).repeat(2).slice(0, length);
    }

    const chars =
        "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    const values = new Uint8Array(length);
    window.crypto.getRandomValues(values);

    return Array.from(values, (value) => chars[value % chars.length]).join("");
};

const createNoncePayload = (length = 10) => {
    if (!isBrowser() || !window.crypto?.getRandomValues) {
        return Array.from({ length }, () =>
            NONCE_RANDOM_CHARS[
                Math.floor(Math.random() * NONCE_RANDOM_CHARS.length)
            ]
        ).join("");
    }

    const values = new Uint8Array(length);
    window.crypto.getRandomValues(values);

    return Array.from(
        values,
        (value) => NONCE_RANDOM_CHARS[value % NONCE_RANDOM_CHARS.length]
    ).join("");
};

const createPkceRandomString = (length = 117) => {
    if (!isBrowser() || !window.crypto?.getRandomValues) {
        return Array.from({ length }, () =>
            NONCE_RANDOM_CHARS[
                Math.floor(Math.random() * NONCE_RANDOM_CHARS.length)
            ]
        ).join("");
    }

    const values = new Uint8Array(length);
    window.crypto.getRandomValues(values);

    return Array.from(
        values,
        (value) => NONCE_RANDOM_CHARS[value % NONCE_RANDOM_CHARS.length]
    ).join("");
};

export const createPkceVerifierFromTimestamp = (
    timestamp,
    randomLength = 117
) => `${timestamp}-${createPkceRandomString(randomLength)}`;

const encodeBase64Url = (buffer) => {
    if (!isBrowser()) return "";

    const bytes = new Uint8Array(buffer);
    let binary = "";

    bytes.forEach((byte) => {
        binary += String.fromCharCode(byte);
    });

    return window.btoa(binary).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/g, "");
};

export const hexToBase64 = (hex) => {
    if (!isBrowser()) return "";

    let binary = "";
    for (let index = 0; index < hex.length; index += 2) {
        binary += String.fromCharCode(parseInt(hex.slice(index, index + 2), 16));
    }

    return window.btoa(binary);
};

export const createNonce = (length = 10) =>
    `${Math.floor(Date.now() / 1000)}-${createNoncePayload(length)}`;

const isValidNonceFormat = (nonce) =>
    typeof nonce === "string" && /^\d{10}-[A-Za-z0-9._~-]+$/.test(nonce);

export const getOrCreateNonce = (length = 10) => {
    if (!isBrowser()) return createNonce(length);

    const existingNonce = window.localStorage.getItem(NONCE_STORAGE_KEY);
    if (isValidNonceFormat(existingNonce)) return existingNonce;

    const nonce = createNonce(length);
    window.localStorage.setItem(NONCE_STORAGE_KEY, nonce);
    return nonce;
};

export const createCodeChallengeFromVerifier = async (codeVerifier) => {
    if (!isBrowser() || !window.crypto?.subtle) {
        return "";
    }

    const encodedVerifier = new TextEncoder().encode(codeVerifier);
    const digest = await window.crypto.subtle.digest("SHA-256", encodedVerifier);

    return encodeBase64Url(digest);
};

export const createPkceBundle = async (randomLength = 117) => {
    const timestamp = Math.floor(Date.now() / 1000);
    const codeVerifier = createPkceVerifierFromTimestamp(timestamp, randomLength);
    const codeChallenge = await createCodeChallengeFromVerifier(codeVerifier);

    return {
        timestamp,
        codeVerifier,
        codeChallenge,
    };
};

export const hashCaptchaValue = async (value) => {
    const normalizedValue = String(value || "").trim().toLowerCase();
    const md5Hex = MD5(normalizedValue).toString();
    return hexToBase64(md5Hex);
};

export const hashMd5Base64 = async (value) => {
    const md5Hex = MD5(String(value ?? "")).toString();
    return hexToBase64(md5Hex);
};

export const normalizeOtpSuffix = (value) =>
    String(value ?? "").replace(/[^a-zA-Z0-9]/g, "").toUpperCase();

export const normalizeOtpPrefix = (value) =>
    String(value ?? "").trim().toUpperCase();

export const hashOtpValue = async (prefix, value) => {
    const normalizedOtpValue = `${normalizeOtpPrefix(prefix)}${normalizeOtpSuffix(
        value
    )}`;

    return {
        normalizedOtpValue,
        hashedValue: await hashMd5Base64(normalizedOtpValue),
    };
};

export const hashCaptchaValueWithStrategy = async (
    value,
    strategy = "trim-lowercase"
) => {
    const rawValue = String(value ?? "");

    let normalizedValue = rawValue;

    switch (strategy) {
        case "raw":
            normalizedValue = rawValue;
            break;
        case "trim":
            normalizedValue = rawValue.trim();
            break;
        case "lowercase":
            normalizedValue = rawValue.toLowerCase();
            break;
        case "trim-uppercase":
            normalizedValue = rawValue.trim().toUpperCase();
            break;
        case "uppercase":
            normalizedValue = rawValue.toUpperCase();
            break;
        case "trim-lowercase":
        default:
            normalizedValue = rawValue.trim().toLowerCase();
            break;
    }

    const md5Hex = MD5(normalizedValue).toString();

    return {
        strategy,
        normalizedValue,
        md5Hex,
        base64: hexToBase64(md5Hex),
    };
};

export const getCaptchaHashCandidates = async (value) => {
    const strategies = [
        "raw",
        "trim",
        "lowercase",
        "trim-lowercase",
        "uppercase",
        "trim-uppercase",
    ];

    const results = await Promise.all(
        strategies.map((strategy) => hashCaptchaValueWithStrategy(value, strategy))
    );

    return results;
};

export const savePkceBundle = (bundle) => {
    if (!isBrowser() || !bundle) return;

    window.localStorage.setItem(
        PKCE_STORAGE_KEY,
        JSON.stringify({
            ...bundle,
            savedAt: new Date().toISOString(),
        })
    );
};

export const getPkceBundle = () => {
    if (!isBrowser()) return null;

    const rawBundle = window.localStorage.getItem(PKCE_STORAGE_KEY);
    if (!rawBundle) return null;

    try {
        return JSON.parse(rawBundle);
    } catch {
        return null;
    }
};

export const getOrCreateDeviceId = () => {
    if (!isBrowser()) return "";

    const existingDeviceId = window.localStorage.getItem(DEVICE_STORAGE_KEY);
    if (existingDeviceId) return existingDeviceId;

    const deviceId = createRandomString(32);
    window.localStorage.setItem(DEVICE_STORAGE_KEY, deviceId);
    return deviceId;
};

export const saveAuthSession = (response) => {
    if (!isBrowser() || !response) return;

    const savedAt = new Date().toISOString();
    const authData = response?.data || {};
    const expiresIn = Number(authData?.expires_in) || 0;
    const expiresAt = expiresIn
        ? new Date(Date.now() + expiresIn * 1000).toISOString()
        : null;

    window.localStorage.setItem(
        AUTH_STORAGE_KEY,
        JSON.stringify({
            ...response,
            data: {
                ...authData,
            },
            savedAt,
            expiresAt,
        })
    );
};

export const getAuthSession = () => {
    if (!isBrowser()) return null;

    const rawSession = window.localStorage.getItem(AUTH_STORAGE_KEY);
    if (!rawSession) return null;

    try {
        return JSON.parse(rawSession);
    } catch {
        return null;
    }
};

export const saveDeviceChallenge = (payload) => {
    if (!isBrowser() || !payload) return;

    window.localStorage.setItem(
        DEVICE_CHALLENGE_STORAGE_KEY,
        JSON.stringify({
            ...payload,
            savedAt: new Date().toISOString(),
        })
    );
};

export const getDeviceChallenge = () => {
    if (!isBrowser()) return null;

    const rawChallenge = window.localStorage.getItem(
        DEVICE_CHALLENGE_STORAGE_KEY
    );
    if (!rawChallenge) return null;

    try {
        return JSON.parse(rawChallenge);
    } catch {
        return null;
    }
};

export const clearDeviceChallenge = () => {
    if (!isBrowser()) return;

    window.localStorage.removeItem(DEVICE_CHALLENGE_STORAGE_KEY);
};

export const saveDeviceAuthSession = (payload) => {
    if (!isBrowser() || !payload) return;

    window.localStorage.setItem(
        DEVICE_AUTH_STORAGE_KEY,
        JSON.stringify({
            ...payload,
            savedAt: new Date().toISOString(),
        })
    );
};

export const getDeviceAuthSession = () => {
    if (!isBrowser()) return null;

    const rawSession = window.localStorage.getItem(DEVICE_AUTH_STORAGE_KEY);
    if (!rawSession) return null;

    try {
        return JSON.parse(rawSession);
    } catch {
        return null;
    }
};

export const clearDeviceAuthSession = () => {
    if (!isBrowser()) return;

    window.localStorage.removeItem(DEVICE_AUTH_STORAGE_KEY);
};

export const saveOtpContext = (payload) => {
    if (!isBrowser() || !payload) return;

    window.localStorage.setItem(
        OTP_CONTEXT_STORAGE_KEY,
        JSON.stringify({
            ...payload,
            savedAt: new Date().toISOString(),
        })
    );
};

export const getOtpContext = () => {
    if (!isBrowser()) return null;

    const rawContext = window.localStorage.getItem(OTP_CONTEXT_STORAGE_KEY);
    if (!rawContext) return null;

    try {
        return JSON.parse(rawContext);
    } catch {
        return null;
    }
};

export const clearOtpContext = () => {
    if (!isBrowser()) return;

    window.localStorage.removeItem(OTP_CONTEXT_STORAGE_KEY);
};

export const clearPkceBundle = () => {
    if (!isBrowser()) return;

    window.localStorage.removeItem(PKCE_STORAGE_KEY);
};

export const saveCaptchaTimer = (expiresInSeconds) => {
    if (!isBrowser() || !expiresInSeconds) return;

    const expiresAtMs = Date.now() + Number(expiresInSeconds) * 1000;
    window.localStorage.setItem(
        CAPTCHA_TIMER_STORAGE_KEY,
        JSON.stringify({
            expiresAtMs,
            savedAt: new Date().toISOString(),
        })
    );
};

export const getCaptchaTimer = () => {
    if (!isBrowser()) return null;

    const rawTimer = window.localStorage.getItem(CAPTCHA_TIMER_STORAGE_KEY);
    if (!rawTimer) return null;

    try {
        const parsed = JSON.parse(rawTimer);
        const expiresAtMs = Number(parsed?.expiresAtMs || 0);
        if (!expiresAtMs) return null;

        const remainingSeconds = Math.max(
            0,
            Math.ceil((expiresAtMs - Date.now()) / 1000)
        );

        return {
            expiresAtMs,
            remainingSeconds,
        };
    } catch {
        return null;
    }
};

export const clearCaptchaTimer = () => {
    if (!isBrowser()) return;

    window.localStorage.removeItem(CAPTCHA_TIMER_STORAGE_KEY);
};

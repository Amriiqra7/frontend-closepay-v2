const AUTH_STORAGE_KEY = "closepay.auth.session";
const DEVICE_STORAGE_KEY = "closepay.auth.device-id";
const NONCE_STORAGE_KEY = "closepay.auth.nonce";
const DEVICE_CHALLENGE_STORAGE_KEY = "closepay.auth.device-challenge";
const PKCE_STORAGE_KEY = "closepay.auth.pkce";
const DEVICE_AUTH_STORAGE_KEY = "closepay.auth.device-auth";
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
    if (!isBrowser()) {
        return Array.from({ length }, () =>
            NONCE_RANDOM_CHARS[
                Math.floor(Math.random() * NONCE_RANDOM_CHARS.length)
            ]
        ).join("");
    }

    if (!window.crypto?.getRandomValues) {
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
    if (!isBrowser()) {
        return Array.from({ length }, () =>
            NONCE_RANDOM_CHARS[
                Math.floor(Math.random() * NONCE_RANDOM_CHARS.length)
            ]
        ).join("");
    }

    if (!window.crypto?.getRandomValues) {
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

const encodeBase64Url = (buffer) => {
    if (!isBrowser()) return "";

    const bytes = new Uint8Array(buffer);
    let binary = "";

    bytes.forEach((byte) => {
        binary += String.fromCharCode(byte);
    });

    return window.btoa(binary).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/g, "");
};

const encodeHex = (buffer) => {
    const bytes = new Uint8Array(buffer);
    return Array.from(bytes, (byte) =>
        byte.toString(16).padStart(2, "0")
    )
        .join("")
        .toUpperCase();
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

export const createPkceBundle = async (randomLength = 117) => {
    const timestamp = Math.floor(Date.now() / 1000);
    const codeVerifier = `${timestamp}-${createPkceRandomString(randomLength)}`;

    if (!isBrowser() || !window.crypto?.subtle) {
        const fallbackBundle = {
            timestamp,
            codeVerifier,
            codeChallenge: "",
        };

        return fallbackBundle;
    }

    const encodedVerifier = new TextEncoder().encode(codeVerifier);
    const digest = await window.crypto.subtle.digest("SHA-256", encodedVerifier);

    return {
        timestamp,
        codeVerifier,
        codeChallenge: encodeBase64Url(digest),
    };
};

export const hashCaptchaValue = async (value) => {
    if (!isBrowser() || !window.crypto?.subtle) {
        return value;
    }

    const encodedValue = new TextEncoder().encode(value);
    const digest = await window.crypto.subtle.digest("SHA-256", encodedValue);
    return encodeHex(digest);
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
    const expiresAt = response?.data?.expires_in
        ? new Date(Date.now() + response.data.expires_in * 1000).toISOString()
        : null;

    window.localStorage.setItem(
        AUTH_STORAGE_KEY,
        JSON.stringify({
            ...response,
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

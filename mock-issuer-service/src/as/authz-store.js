import crypto from "crypto";

export const authCodeStore = new Map();
export const accessTokenStore = new Map();
export const preAuthCodeStore = new Map();
export const issuerStateStore = new Map();
export const stageTestErrorStore = new Map();

// DPoP nonce store: nonce → expiry timestamp (ms)
export const dpopNonceStore = new Map();

export function generateAuthCode() {
  return crypto.randomBytes(16).toString("hex");
}

export function generateAccessToken() {
  return crypto.randomBytes(16).toString("hex");
}

/** Generates a fresh server-issued DPoP nonce (valid for 5 min). */
export function generateDPoPNonce() {
  const nonce = crypto.randomBytes(16).toString("base64url");
  dpopNonceStore.set(nonce, Date.now() + 5 * 60 * 1000);
  return nonce;
}

/** Returns true if the nonce exists and is not expired. */
export function isDPoPNonceValid(nonce) {
  const expiry = dpopNonceStore.get(nonce);
  if (!expiry) return false;
  if (Date.now() > expiry) {
    dpopNonceStore.delete(nonce);
    return false;
  }
  return true;
}

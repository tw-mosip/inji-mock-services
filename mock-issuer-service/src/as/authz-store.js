import crypto from "crypto";

export const authCodeStore = new Map();
export const accessTokenStore = new Map();
export const preAuthCodeStore = new Map();

export function generateAuthCode() {
  return crypto.randomBytes(16).toString("hex");
}

export function generateAccessToken() {
  return crypto.randomBytes(16).toString("hex");
}

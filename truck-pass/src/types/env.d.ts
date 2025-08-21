// src/types/env.d.ts
export {};

declare global {
  interface Window {
    _env_: {
      SCOPE_USER_PROFILE?: string;
      SCOPE_REGISTRATION?: string;
      DISPLAY?: string;
      PROMPT?: string;
      GRANT_TYPE?: string;
      MAX_AGE?: number | string;
      CLAIMS_LOCALES?: string;
      CLIENT_ID: string;
      ESIGNET_UI_BASE_URL: string;
      REDIRECT_URI_USER_PROFILE?: string;
      REDIRECT_URI_REGISTRATION?: string;
      REDIRECT_URI: string;
      ACRS?: string;
      CLAIMS_USER_PROFILE?: string;
      CLAIMS_REGISTRATION?: string;
    };
  }
}

type NullableString = string | undefined | null;

// Util for safe defaulting
function checkEmptyNullValue(
  initialValue: NullableString,
  defaultValue: string
): string {
  return initialValue && initialValue !== "" ? initialValue : defaultValue;
}

// Random string generator
function generateRandomString(strLength = 16): string {
  let result = "";
  const characters = "abcdefghijklmnopqrstuvwxyz0123456789";
  for (let i = 0; i < strLength; i++) {
    const randomInd = Math.floor(Math.random() * characters.length);
    result += characters.charAt(randomInd);
  }
  return result;
}

// Core values
const state = "eree2311";
const nonce = generateRandomString();
const responseType = "code";

const {
  SCOPE_USER_PROFILE,
  SCOPE_REGISTRATION,
  DISPLAY,
  PROMPT,
  GRANT_TYPE,
  MAX_AGE,
  CLAIMS_LOCALES,
  CLIENT_ID,
  ESIGNET_UI_BASE_URL,
  REDIRECT_URI,
  REDIRECT_URI_USER_PROFILE,
  REDIRECT_URI_REGISTRATION,
  ACRS,
  CLAIMS_USER_PROFILE,
  CLAIMS_REGISTRATION,
} = window._env_;

const scopeUserProfile = checkEmptyNullValue(
  SCOPE_USER_PROFILE,
  "openid profile"
);
const scopeRegistration = checkEmptyNullValue(
  SCOPE_REGISTRATION,
  "openid profile"
);
const display = checkEmptyNullValue(DISPLAY, "page");
const prompt = checkEmptyNullValue(PROMPT, "consent");
const grantType = checkEmptyNullValue(GRANT_TYPE, "authorization_code");
const maxAge = MAX_AGE;
const claimsLocales = checkEmptyNullValue(CLAIMS_LOCALES, "en");

const redirect_uri_userprofile = checkEmptyNullValue(
  REDIRECT_URI_USER_PROFILE,
  REDIRECT_URI
);
const redirect_uri_registration = checkEmptyNullValue(
  REDIRECT_URI_REGISTRATION,
  REDIRECT_URI
);

const userProfileClaims = checkEmptyNullValue(CLAIMS_USER_PROFILE, "{}");
const registrationClaims = checkEmptyNullValue(CLAIMS_REGISTRATION, "{}");

// Claim defaults
const defaultClaims = {
  userinfo: {
    given_name: { essential: true },
    phone_number: { essential: false },
    email: { essential: true },
    picture: { essential: false },
    gender: { essential: false },
    birthdate: { essential: false },
    address: { essential: false },
  },
  id_token: {},
};

// Final client details
const clientDetails = {
  nonce,
  state,
  clientId: CLIENT_ID,
  scopeUserProfile,
  scopeRegistration,
  response_type: responseType,
  redirect_uri_userprofile,
  redirect_uri_registration,
  display,
  prompt,
  acr_values: ACRS,
  claims_locales: claimsLocales,
  max_age: maxAge,
  grant_type: grantType,
  uibaseUrl: ESIGNET_UI_BASE_URL,
  authorizeEndpoint: "/authorize",
  userProfileClaims: userProfileClaims ?? encodeURIComponent(JSON.stringify(defaultClaims)),
  registrationClaims: registrationClaims ?? encodeURIComponent(JSON.stringify(defaultClaims)),
};

export default clientDetails;

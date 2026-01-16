#!/bin/sh

cat <<EOF > /usr/share/nginx/html/env.config.js
window._env_ = {
  ESIGNET_UI_BASE_URL: "${ESIGNET_BASE_URL}",
  MOCK_RELYING_PARTY_SERVER_URL: "${MOCK_RELYING_PARTY_SERVER_URL}",
  REDIRECT_URI_USER_PROFILE: "${FRONTEND_URL}/driverRegistrationProcessPage/verifyUINPage",
  REDIRECT_URI_REGISTRATION: "${FRONTEND_URL}/driverRegistrationProcessPage/verifyUINPage",
  REDIRECT_URI: "${FRONTEND_URL}/driverRegistrationProcessPage/verifyUINPage",
  CLIENT_ID: "${CLIENT_ID}",
  ACRS: "mosip:idp:acr:generated-code%20mosip:idp:acr:biometrics%20mosip:idp:acr:static-code",
  SCOPE_USER_PROFILE: "openid%20profile%20resident-service",
  SCOPE_REGISTRATION: "openid%20profile",
  CLAIMS_USER_PROFILE: "%7B%22userinfo%22:%7B%22given_name%22:%7B%22essential%22:true%7D,%22phone_number%22:%7B%22essential%22:false%7D,%22email%22:%7B%22essential%22:true%7D,%22picture%22:%7B%22essential%22:false%7D,%22gender%22:%7B%22essential%22:false%7D,%22birthdate%22:%7B%22essential%22:false%7D,%22address%22:%7B%22essential%22:false%7D%7D,%22id_token%22:%7B%7D%7D",
  CLAIMS_REGISTRATION: "%7B%22userinfo%22:%7B%22given_name%22:%7B%22essential%22:true%7D,%22phone_number%22:%7B%22essential%22:false%7D,%22email%22:%7B%22essential%22:true%7D,%22picture%22:%7B%22essential%22:false%7D,%22gender%22:%7B%22essential%22:false%7D,%22birthdate%22:%7B%22essential%22:false%7D,%22address%22:%7B%22essential%22:false%7D%7D,%22id_token%22:%7B%7D%7D",
  SIGN_IN_BUTTON_PLUGIN_URL: "${SIGN_IN_BUTTON_PLUGIN_URL}",
  DISPLAY: "${CLIENT_DISPLAY}",
  PROMPT: "consent",
  GRANT_TYPE: "authorization_code",
  MAX_AGE: ${MAX_AGE},
  CLAIMS_LOCALES: "en",
  DEFAULT_LANG: "en",
  FALLBACK_LANG: "%7B%22label%22%3A%22English%22%2C%22value%22%3A%22en%22%7D"
}
EOF

exec "$@"
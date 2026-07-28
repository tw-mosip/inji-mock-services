import { generateAuthCode, authCodeStore, issuerStateStore } from "./authz-store.js";

export default function loginHandler(req, res) {
  const { client_id, redirect_uri, state, issuer_state: issuerState, dpop_jkt } = req.body;

  const code = generateAuthCode();
  const issuerStateEntry = issuerState ? issuerStateStore.get(issuerState) : null;

  authCodeStore.set(code, {
    client_id,
    redirect_uri,
    state,
    dpop_jkt: dpop_jkt || null,   // RFC 9449 §10 — key binding
    created_at: Date.now(),
    testError: issuerStateEntry?.testError || null,
  });
  console.log(
    `Auth code issued for client_id=${client_id}${dpop_jkt ? ` (dpop_jkt bound: ${dpop_jkt})` : " (no dpop_jkt)"}`,
  );
  if (issuerState) issuerStateStore.delete(issuerState);

  const redirectURL = new URL(redirect_uri);
  redirectURL.searchParams.set("code", code);

  if (state) redirectURL.searchParams.set("state", state);

  return res.redirect(302, redirectURL.toString());
}

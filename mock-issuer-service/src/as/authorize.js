import fs from "fs";
import path from "path";
import { issuerStateStore, stageTestErrorStore } from "./authz-store.js";
import { hasExplicitVersion, resolveRequestVersion } from "../issuer-profile.js";
import { envTestError } from "../test-errors.js";

export default function authorizeHandler(req, res) {
  const { client_id, redirect_uri, state, issuer_state, dpop_jkt } = req.query;
  const version = resolveRequestVersion(req);
  const flowSegment = req.params?.flow === "pdi" ? "/pdi" : "";
  const loginAction = hasExplicitVersion(req)
    ? `/${version}${flowSegment}/as/login`
    : `${flowSegment}/as/login`;
  console.log("Looking for HTML at:", path.resolve("src/as/login-page.html"));

  if (!client_id || !redirect_uri) {
    return res.status(400).send("missing client_id or redirect_uri");
  }

  const issuerStateEntry = issuer_state ? issuerStateStore.get(issuer_state) : null;
  const testError = envTestError("authorization") || issuerStateEntry?.testError || stageTestErrorStore.get("authorization");
  if (testError?.stage === "authorization") {
    if (issuer_state) issuerStateStore.delete(issuer_state);
    stageTestErrorStore.delete("authorization");
    const redirectURL = new URL(redirect_uri);
    redirectURL.searchParams.set("error", testError.responseCode);
    redirectURL.searchParams.set("error_description", testError.description);
    if (state) redirectURL.searchParams.set("state", state);
    return res.redirect(302, redirectURL.toString());
  }

  if (dpop_jkt) {
    console.log("dpop_jkt received in authorization request:", dpop_jkt);
  }

  console.log("Serving login page for client_id:", client_id);
  console.log("Redirect URI:", redirect_uri);

  // Load template
  const template = fs.readFileSync(
    path.resolve("src/as/login-page.html"),
    "utf8"
  );

  // Replace placeholders
  const html = template
    .replace("{{client_id}}", client_id)
    .replace("{{redirect_uri}}", redirect_uri)
    .replace("{{form_action}}", loginAction)
    .replace("{{state}}", state || "")
    .replace("{{issuer_state}}", issuer_state || "")
    .replace("{{dpop_jkt}}", dpop_jkt || "");

  res.set("Content-Type", "text/html");
  res.send(html);
}

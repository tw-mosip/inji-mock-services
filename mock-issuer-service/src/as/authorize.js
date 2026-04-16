import fs from "fs";
import path from "path";
import { hasExplicitVersion, resolveRequestVersion } from "../issuer-profile.js";

export default function authorizeHandler(req, res) {
  const { client_id, redirect_uri, state } = req.query;
  const version = resolveRequestVersion(req);
  const flowSegment = req.params?.flow === "pdi" ? "/pdi" : "";
  const loginAction = hasExplicitVersion(req)
    ? `/${version}${flowSegment}/as/login`
    : `${flowSegment}/as/login`;
  console.log("Looking for HTML at:", path.resolve("src/as/login-page.html"));

  if (!client_id || !redirect_uri) {
    return res.status(400).send("missing client_id or redirect_uri");
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
    .replace("{{state}}", state || "");

  res.set("Content-Type", "text/html");
  res.send(html);
}

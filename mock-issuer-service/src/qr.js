import QRCode from "qrcode";
import { ISSUER } from "./issuer-metadata.js";
import { buildOfferUrl, resolveIssuanceOptions } from "./issuance-options.js";

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

function buildQrPayload(options, pin = null) {
  let offerUri = buildOfferUrl(ISSUER, options);
  if (pin) {
    const url = new URL(offerUri);
    url.searchParams.set("tx_code", pin);
    offerUri = url.toString();
  }

  return {
    offerUri,
    qrData:
      "openid-credential-offer://?credential_offer_uri=" +
      encodeURIComponent(offerUri),
  };
}

function optionButton(name, value, currentValue, label, hint) {
  const checked = value === currentValue ? "checked" : "";

  return `
    <label class="toggle-option">
      <input type="radio" name="${escapeHtml(name)}" value="${escapeHtml(value)}" ${checked} />
      <span>${escapeHtml(label)}</span>
      <small>${escapeHtml(hint)}</small>
    </label>
  `;
}

function renderPage(options, pin = null) {
  const { offerUri } = buildQrPayload(options, pin);

  const queryParams = new URLSearchParams({
    flow: options.flow,
    version: options.version,
    credential: options.credential
  });
  if (pin) queryParams.set("tx_code", pin);

  const qrImageUrl = `/qr/image?${queryParams.toString()}`;
  const offerPreviewUrl = `/credential-offer?${queryParams.toString()}`;

  const flowLabels = {
    normal: "Normal (Auth Code)",
    pdi: "PDI (Presentation)",
    "pre-auth": "Pre-Auth",
    "pre-auth-tx": "Pre-Auth + TX Code"
  };
  const flowLabel = flowLabels[options.flow] || options.flow;
  const versionLabel = options.version === "draft13" ? "Draft 13" : "V1";

  return `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>Mock Issuer Console</title>
    <style>
      :root {
        color-scheme: light;
        --page-bg: #f4f7f5;
        --surface: #ffffff;
        --surface-muted: #ebf1ec;
        --text: #15231b;
        --text-muted: #537161;
        --border: #c8d6cc;
        --accent: #176b52;
        --accent-strong: #0f4f3d;
        --accent-soft: #d8ece4;
        --highlight: #d29a26;
      }

      * { box-sizing: border-box; }

      body {
        margin: 0;
        font-family: Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
        background: linear-gradient(180deg, #eff5f1 0%, var(--page-bg) 100%);
        color: var(--text);
      }

      main {
        max-width: 1160px;
        margin: 0 auto;
        padding: 32px 20px 40px;
      }

      .hero {
        display: grid;
        grid-template-columns: minmax(0, 1.1fr) minmax(320px, 420px);
        gap: 24px;
        align-items: start;
      }

      .hero-main {
        display: grid;
        gap: 24px;
        align-content: start;
      }

      .intro {
        padding: 8px 0 0;
      }

      h1 {
        margin: 0 0 12px;
        font-size: clamp(32px, 5vw, 54px);
        line-height: 1.02;
      }

      .intro p {
        max-width: 58ch;
        margin: 0;
        color: var(--text-muted);
        font-size: 17px;
        line-height: 1.6;
      }

      .summary-grid {
        display: grid;
        grid-template-columns: repeat(3, minmax(0, 1fr));
        gap: 12px;
        margin-top: 28px;
      }

      .summary-item {
        padding: 14px;
        border: 1px solid var(--border);
        border-radius: 8px;
        background: rgba(255, 255, 255, 0.82);
      }

      .summary-item strong,
      .panel h2,
      .preview h2 {
        display: block;
        font-size: 13px;
        text-transform: uppercase;
        letter-spacing: 0;
        color: var(--text-muted);
        margin-bottom: 8px;
      }

      .summary-item span {
        display: block;
        font-size: 18px;
        font-weight: 700;
      }

      .panel,
      .preview {
        border: 1px solid var(--border);
        border-radius: 8px;
        background: var(--surface);
      }

      .panel {
        padding: 24px;
      }

      .control-group + .control-group {
        margin-top: 24px;
      }

      .control-group p {
        margin: 0 0 12px;
        color: var(--text-muted);
        line-height: 1.5;
      }

      .toggle-grid {
        display: grid;
        grid-template-columns: repeat(2, minmax(0, 1fr));
        gap: 12px;
      }

      .toggle-option {
        display: block;
        padding: 14px;
        border: 1px solid var(--border);
        border-radius: 8px;
        background: var(--surface-muted);
        cursor: pointer;
      }

      .toggle-option input {
        position: absolute;
        opacity: 0;
        pointer-events: none;
      }

      .toggle-option span {
        display: block;
        font-size: 16px;
        font-weight: 700;
      }

      .toggle-option small {
        display: block;
        margin-top: 6px;
        color: var(--text-muted);
        line-height: 1.5;
      }

      .toggle-option:has(input:checked) {
        border-color: var(--accent);
        background: var(--accent-soft);
        box-shadow: inset 0 0 0 1px var(--accent);
      }

      .toggle-option:has(input:focus-visible) {
        outline: 2px solid rgba(23, 107, 82, 0.28);
        outline-offset: 2px;
      }

      .preview {
        padding: 24px;
      }

      .qr-shell {
        display: grid;
        justify-items: center;
        gap: 18px;
        padding: 22px;
        border: 1px solid var(--border);
        border-radius: 8px;
        background: linear-gradient(180deg, #ffffff 0%, #f4f8f5 100%);
      }

      .qr-shell img {
        width: min(100%, 320px);
        height: auto;
        border-radius: 8px;
        background: #fff;
      }

      .callout {
        margin: 0;
        color: var(--text-muted);
        text-align: center;
        line-height: 1.5;
      }

      .meta-list {
        margin: 18px 0 0;
        padding: 0;
        list-style: none;
        display: grid;
        gap: 12px;
      }

      .meta-list li {
        padding: 12px 0;
        border-top: 1px solid var(--border);
      }

      .meta-list li:first-child {
        border-top: 0;
        padding-top: 0;
      }

      .meta-list strong {
        display: block;
        margin-bottom: 6px;
        font-size: 13px;
        text-transform: uppercase;
        letter-spacing: 0;
        color: var(--text-muted);
      }

      code {
        display: block;
        white-space: pre-wrap;
        word-break: break-word;
        padding: 10px 12px;
        border-radius: 8px;
        background: #10251d;
        color: #effbf4;
        font-size: 12px;
        line-height: 1.55;
      }

      .actions {
        display: flex;
        flex-wrap: wrap;
        gap: 10px;
        margin-top: 20px;
      }

      .button-link {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        min-height: 42px;
        padding: 0 14px;
        border: 1px solid var(--accent);
        border-radius: 8px;
        text-decoration: none;
        font-weight: 700;
        color: var(--accent-strong);
        background: white;
      }

      .button-link.primary {
        background: var(--accent);
        color: white;
      }

      .footer-note {
        margin-top: 20px;
        color: var(--text-muted);
        font-size: 14px;
        line-height: 1.6;
      }

      @media (max-width: 920px) {
        .hero,
        .workspace {
          grid-template-columns: 1fr;
        }

        .summary-grid,
        .toggle-grid {
          grid-template-columns: 1fr;
        }
      }
    </style>
  </head>
  <body>
    <main>
      <section class="hero">
        <div class="hero-main">
          <div class="intro">
            <h1>Build the exact QR experience you want to test.</h1>
            <p>Switch flow, version, and credential type, then scan.</p>
            <div class="summary-grid">
              <div class="summary-item">
                <strong>Auth flow</strong>
                <span>${escapeHtml(flowLabel)}</span>
              </div>
              <div class="summary-item">
                <strong>Issuer profile</strong>
                <span>${escapeHtml(versionLabel)}</span>
              </div>
              <div class="summary-item">
                <strong>Credential</strong>
                <span>${escapeHtml(options.credentialDetails.label)}</span>
              </div>
            </div>
          </div>

          <form class="panel" id="issuer-controls">
            <div class="control-group">
              <h2>Authorization flow</h2>
              <div class="toggle-grid">
                ${optionButton("flow", "normal", options.flow, "Normal", "Auth Code flow")}
                ${optionButton("flow", "pre-auth", options.flow, "Pre-Auth", "Pre-Authorized Code flow")}
                ${optionButton("flow", "pre-auth-tx", options.flow, "Pre-Auth + TX", "Pre-Auth with 4-digit PIN")}
                ${optionButton("flow", "pdi", options.flow, "PDI", "Presentation during issuance")}
              </div>
            </div>

            <div class="control-group">
              <h2>Spec version</h2>
              <div class="toggle-grid">
                ${optionButton("version", "v1", options.version, "V1", "Final issuer profile")}
                ${optionButton("version", "draft13", options.version, "Draft 13", "Legacy issuer profile")}
              </div>
            </div>

            <div class="control-group">
              <h2>Credential type</h2>
              <div class="toggle-grid">
                ${optionButton("credential", "farmer", options.credential, "Farmer credential", "LDP VC")}
                ${optionButton("credential", "employee", options.credential, "Employee credential", "JWT VC")}
                ${optionButton("credential", "sd-jwt", options.credential, "SD-JWT Employee", "Selective Disclosure")}
                ${optionButton("credential", "mdoc", options.credential, "Mobile DL", "ISO 18013-5 mdoc")}
              </div>
            </div>
          </form>
        </div>

        <aside class="preview">
          <h2>Live QR</h2>
          <div class="qr-shell">
            <img src="${escapeHtml(qrImageUrl)}" alt="Credential offer QR code" />
            <p class="callout">Scan this from a wallet. Every toggle updates the encoded credential offer URI.</p>
          </div>
          <ul class="meta-list">
            ${pin ? `
            <li>
              <strong style="color: var(--highlight);">Transaction PIN (TX Code)</strong>
              <code style="font-size: 24px; text-align: center; letter-spacing: 4px;">${escapeHtml(pin)}</code>
              <small style="display: block; margin-top: 8px; color: var(--text-muted);">This PIN is delivered out-of-band. Enter this in your wallet when prompted.</small>
            </li>
            ` : ""}
            <li>
              <strong>Offer URI</strong>
              <code>${escapeHtml(offerUri)}</code>
            </li>
            <li>
              <strong>Credential profile</strong>
              <code>${escapeHtml(options.credentialDetails.configurationId)} | ${escapeHtml(options.credentialDetails.format)}</code>
            </li>
          </ul>
          <div class="actions">
            <a class="button-link primary" href="${escapeHtml(qrImageUrl)}" target="_blank" rel="noreferrer">Open Raw QR</a>
            <a class="button-link" href="${escapeHtml(offerPreviewUrl)}" target="_blank" rel="noreferrer">Open Offer JSON</a>
          </div>
          <p class="footer-note">PDI mode keeps the authorization code grant but also advertises the interactive authorization endpoint for presentation-driven testing.</p>
        </aside>
      </section>
    </main>

    <script>
      const form = document.getElementById("issuer-controls");
      form.addEventListener("change", () => {
        const data = new FormData(form);
        const params = new URLSearchParams(data);
        window.location.search = params.toString();
      });
    </script>
  </body>
</html>`;
}

export async function qrImageHandler(req, res) {
  const options = resolveIssuanceOptions(req.query);
  const pin = req.query.tx_code;
  const { qrData } = buildQrPayload(options, pin);

  try {
    const png = await QRCode.toBuffer(qrData, {
      type: "png",
      width: 400,
      errorCorrectionLevel: "M",
    });

    res.setHeader("Content-Type", "image/png");
    res.send(png);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "QR generation failed" });
  }
}

export default async function qrPageHandler(req, res) {
  const options = resolveIssuanceOptions(req.query);
  let pin = req.query.tx_code;

  if (options.flow === "pre-auth-tx" && !pin) {
    pin = Math.floor(1000 + Math.random() * 9000).toString();
    const params = new URLSearchParams(req.query);
    params.set("tx_code", pin);
    return res.redirect(`/qr?${params.toString()}`);
  } else if (options.flow !== "pre-auth-tx" && pin) {
    const params = new URLSearchParams(req.query);
    params.delete("tx_code");
    return res.redirect(`/qr?${params.toString()}`);
  }

  res.setHeader("Content-Type", "text/html; charset=utf-8");
  res.send(renderPage(options, pin));
}

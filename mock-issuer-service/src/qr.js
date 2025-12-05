import QRCode from "qrcode";
import { ISSUER } from "./issuer-metadata.js";

export default async function qrHandler(req, res) {
  const offerUri =
    `${ISSUER}/credential-offer`;

  // According to spec: openid-credential-offer://?credential_offer_uri=<URL>
  const qrData =
    "openid-credential-offer://?credential_offer_uri=" +
    encodeURIComponent(offerUri);

  try {
    const png = await QRCode.toBuffer(qrData, {
      type: "png",
      width: 400,
      errorCorrectionLevel: "M"
    });

    res.setHeader("Content-Type", "image/png");
    res.send(png);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "QR generation failed" });
  }
}

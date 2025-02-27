const express = require("express");
const axios = require("axios");
const path = require("path");
const QRCode = require("qrcode");
const bodyParser = require("body-parser");
const app = express();
const PORT = 3000;

app.use(bodyParser.urlencoded({ limit: "20mb", extended: true }));
app.set("view engine", "ejs");

app.set("views", path.join(__dirname, "views"));

app.use(express.static(path.join(__dirname, "public")));

app.get("/credential-offer/by-reference", async (req, res) => {
  try {
    const credentialOfferEndPoint = `https://openid.pre.vc-dts.sicpa.com/credential-offer/0195128b-3d2f-7c8c-824f-60c3a395f753`;
    const qrCodeData = await QRCode.toDataURL(
      `openid-credential-offer://?credential_offer_uri=${credentialOfferEndPoint}`
    );

    res.render("index", {
      title: "Credential Offer End point",
      qrCodeData,
      body: "Credential Offer URI",
    });
  } catch (error) {
    console.error("Error generating QR code:", error);
    res.status(500).send("Internal Server Error");
  }
});

const credentialOffer = {
  credential_issuer:
    "https://funke.animo.id/oid4vci/188e2459-6da8-4431-9062-2fcdac274f41",
  credential_configuration_ids: ["mobile-drivers-license-ldp-vc"],
  grants: {
    "urn:ietf:params:oauth:grant-type:pre-authorized_code": {
      "pre-authorized_code": "gtC7uy4qZc1PipRWzwrykmwBd8fN5rIJ",
      "tx_code":{
        "input_mode":"numeric",
        "length":3
      },
      "authorization_server": "https://funke.animo.id/oid4vci/188e2459-6da8-4431-9062-2fcdac274f41"
    },
  },
};

app.get("/credential-offer/by-value", async (req, res) => {
  try {
    const credentialOfferEncoded = encodeURIComponent(
      JSON.stringify(credentialOffer)
    );

    const qrCodeData = await QRCode.toDataURL(
      `openid-credential-offer://?credential_offer=${credentialOfferEncoded}`
    );

    res.render("index", {
      title: "Credential Offer End point",
      qrCodeData,
      body: "Credential Offer Data",
    });
  } catch (error) {
    console.error("Error generating QR code:", error);
    res.status(500).send("Internal Server Error");
  }
});

app.get("/credential-offer/by-reference/curl", async (req, res) => {
  try {
    // Make API call to issue credential
    const response = await axios.post(
      "https://wallet.acc.credenco.com/api/credential/issue/iban",
      { iban: "NL07RABO9127357228", key2: "John Koster" },
      {
        headers: {
          "x-api-key": "V0Mcrd7tf39oUSXDYekG539ZyGqj",
          "Content-Type": "application/json",
        },
      }
    );

    const credentialOffer = response.data;

    const qrCodeData = await QRCode.toDataURL(credentialOffer);

    res.render("index", {
      title: "Credential Offer Endpoint",
      qrCodeData,
      body: "Credential Offer Data",
    });
  } catch (error) {
    console.error("Error generating QR code:", error);
    res.status(500).send("Internal Server Error");
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

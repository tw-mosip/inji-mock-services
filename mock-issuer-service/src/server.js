import express from "express";
import https from "https";
import fs from "fs";
import cors from "cors";
import authServerMetadata from "./as/metadata.js";
import credentialOfferHandler from "./credential/offer.js";
import issuerMetadata from "./issuer-metadata.js";
import qrHandler from "./qr.js";
import authorizeHandler from "./as/authorize.js";
import interactiveAuthorizationHandler from "./as/interactive-authorization.js";
import tokenHandler from "./as/token.js";
import credentialHandler from "./credential/endpoint.js";
import loginHandler from "./as/login.js";

const app = express();
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cors());




// ---- QR CODE ---- //
app.get("/qr", qrHandler);

// ---- WELL-KNOWN ---- //
app.get("/.well-known/openid-credential-issuer", issuerMetadata);


// ------------------------------
// AUTHORIZATION SERVER METADATA
// ------------------------------
app.get(
    "/as/.well-known/oauth-authorization-server",
    authServerMetadata
  );

// --------------
// CREDENTIAL OFFER
// --------------

app.get("/credential-offer", credentialOfferHandler);


// ---- AUTHORIZATION SERVER ---- //
// app.get("/as/authorize", authorizeHandler);
app.post("/as/interactive-authorization", interactiveAuthorizationHandler);
app.post("/as/token", tokenHandler);
app.get("/as/authorize", authorizeHandler);

// login form handler
app.post("/as/login", express.urlencoded({ extended: true }), loginHandler);

// ---- CREDENTIAL ENDPOINT ---- //
app.post("/credential", credentialHandler);

// ---- HTTPS SERVER ---- //
const options = {
  key: fs.readFileSync("cert/server.key"),
  cert: fs.readFileSync("cert/server.cert")
};

https.createServer(options, app).listen(4000, () => {
  console.log("Mock Issuer running at https://mock-issuer.local:4000");
});

# Mock OID4VC Issuer (Express)

A lightweight **mock OpenID for Verifiable Credential Issuer** built with **Node.js + Express**, useful for local development and testing of:

* Credential Offers
* Issuer Metadata
* Authorization Code / Pre-Auth flows
* Token endpoint
* Credential endpoint
* QR-based initiation

---

## 📦 Features

* ✅ OpenID Credential Issuer metadata
* ✅ OAuth Authorization Server metadata
* ✅ Credential Offer endpoint
* ✅ Authorization + Token flow
* ✅ Credential issuance endpoint
* ✅ Support for multiple formats: **LDP-VC, JWT-VC, SD-JWT, and mdoc**
* ✅ HTTPS support (required by wallets)
* ✅ QR endpoint for easy testing

---

## 🧱 Tech Stack

* Node.js (ESM)
* Express
* HTTPS (self-signed cert)
* No database (fully in-memory)

---

## 🚀 Getting Started

### 1️⃣ Prerequisites

Make sure you have:

* **Node.js ≥ 18**
* **npm** (comes with Node)
* Basic understanding of OAuth / OID4VC (optional but helpful)

Check version:

```bash
node -v
```

---

### 2️⃣ Clone the Repository

```bash
git clone <your-repo-url>
cd mock-issuer
```

---

### 3️⃣ Install Dependencies

```bash
npm install
```

---

### 4️⃣ Generate HTTPS Certificates (Required)

Most wallets **require HTTPS**, even locally. Create a `cert/` directory:

```bash
mkdir cert
```

Generate a self-signed certificate:

```bash
openssl req -x509 -newkey rsa:2048 -nodes \
  -keyout cert/server.key \
  -out cert/server.cert \
  -days 365
```

> 💡 When prompted:
>
> * **Common Name** → `mock-issuer.local`

---

### 5️⃣ Add Host Entry (Important)

Map the issuer domain to localhost. Edit `/etc/hosts` (macOS / Linux):

```bash
sudo nano /etc/hosts
```

Add:

```
127.0.0.1 mock-issuer.local
```

---

### 6️⃣ Start the Server

```bash
node index.js
```

You should see:

```text
Mock Issuer running at https://mock-issuer.local:4000
```

---

## 🔌 Available Endpoints

### 🔹 QR Code

```
GET /qr
```

Returns a QR code that initiates the credential flow.

---

### 🔹 Issuer Metadata

```
GET /.well-known/openid-credential-issuer
```

OID4VC Issuer metadata.

---

### 🔹 Authorization Server Metadata

```
GET /as/.well-known/oauth-authorization-server
```

OAuth AS discovery document.

---

### 🔹 Credential Offer

```
GET /credential-offer
```

Returns a credential offer (by value).

---

### 🔹 Authorization Endpoint

```
GET /as/authorize
```

Starts the authorization flow.

---

### 🔹 Login Handler

```
POST /as/login
```

Handles user login during authorization.

---

### 🔹 Interactive Authorization

```
POST /as/interactive-authorization
```

Handles consent / interaction step.

---

### 🔹 Token Endpoint

```
POST /as/token
```

Exchanges auth code / pre-auth code for access token.

---

### 🔹 Credential Endpoint

```
POST /credential
```

Issues the credential.

---

## 🧪 Testing with a Wallet

1. Start the mock issuer
2. Open wallet app (Inji, custom wallet, etc.)
3. Scan QR from:
   ```
   https://mock-issuer.local:4000/qr
   ```
4. Complete auth / consent
5. Receive credential 🎉

---

## ⚠️ Notes & Limitations

* ❌ No persistence (restart = reset)
* ❌ Not production-ready
* ❌ No real authentication
* ✅ Intended only for **local development & demos**

---

## 🧩 Project Structure (Quick Overview)

```
.
├── as/
│   ├── metadata.js
│   ├── authorize.js
│   ├── token.js
│   ├── login.js
│   └── interactive-authorization.js
├── credential/
│   ├── offer.js
│   └── endpoint.js
├── cert/
│   ├── server.key
│   └── server.cert
├── qr.js
├── issuer-metadata.js
├── index.js
└── package.json
```

---

## 🛠 Customization Tips

* Update credential claims in `credential/endpoint.js`
* Modify issuer metadata in `issuer-metadata.js`
* Adjust flows in `as/*` handlers
* Change port or domain in `index.js`

---

## 🌐 Working with ngrok & OpenID4VP Service

### Setting up ngrok tunnels

If you want to test with external wallets or integrate with an OpenID4VP service, you'll need public URLs:

**1. Expose the Issuer (Port 4000)**

```bash
ngrok http 4000
```

Copy the ngrok URL (e.g., `https://abc123.ngrok.io`)

**2. Expose the OpenID4VP Service (Port 3000)**

In a separate terminal:

```bash
ngrok http 3000
```

Copy the ngrok URL (e.g., `https://xyz789.ngrok.io`)

---

### Updating Issuer URLs

Replace this instace of ISSUER `https://mock-issuer.local:4000` with your **port 4000 ngrok URL** in:
```export const ISSUER = "https://e4845fb4e9e7.ngrok-free.app";``` 
in issuer-metadata.js

**Example:**

```javascript
// Before
const ISSUER = 'https://mock-issuer.local:4000';

// After
const ISSUER = 'https://abc123.ngrok.io';
```

---

### Integrating with OpenID4VP Service

If you're running a separate OpenID4VP verifier service on **port 3000**:

**1. Start the VP Service**

```bash
cd /path/to/openid4vp-service
node index.js
```

### Verifier Configuration for PDI Flow

The file `src/as/verifier-config.js` is used by the issuer during the **PDI interactive authorization flow**.

When the issuer handles `POST /as/interactive-authorization`, it loads the values from `verifier-config.js`, calls the verifier service, and uses the returned verifier request object as the `openid4vp_request` sent back to the wallet.

This helps you customize verifier behavior for PDI without changing the interactive authorization handler itself.

You can use `verifier-config.js` to control:

* `specVersion`: selects whether the verifier request is built for `draft-23` or `version-1.0`
* `responseMode`: controls how the verifier expects the presentation response
* `clientIdPrefix`: selects the verifier client ID prefix such as `did` (draft-23), `decentralized_identifier` (version-1.0), `redirect_uri`, or `pre-registered`
* `requestMode`: switches between `by_value` and `by_reference`
* `verifierBaseUrl`: points the issuer to the verifier service instance to call
* `signedRequest`: enables or disables signed verifier requests
* `presentationDefinition`: used when the selected spec version is `draft-23`
* `dcqlQuery`: used when the selected spec version is `version-1.0`

In practice, this means you can change the verifier requirements for a PDI run by editing one config file before starting the flow. For example, you can switch from presentation-definition based requests to DCQL-based requests, change the verifier endpoint, or test signed versus unsigned requests.

**Example:**

* Set `specVersion` to `draft-23` and update `presentationDefinition` to test a presentation-definition based verifier request.
* Set `specVersion` to `version-1.0` and update `dcqlQuery` to test a DCQL-based verifier request.
* Change `verifierBaseUrl` when your verifier is exposed through ngrok or another public tunnel.

**3. Link Services**

To make changes in the VP service reflect in the issuer:

* Update the issuer's credential format to match VP requirements
* Ensure both services use compatible DID methods
* Configure the issuer to reference VP service endpoints in [interactive-authorization.js](src/as/interactive-authorization.js)(e.g., for presentation definitions)

**Example Integration:**

```javascript
// Reference VP service for additional flows
const presentationDefinition = await fetch(`${VP_SERVICE_URL}/presentation-definition`);
```

---

### 🔄 Quick Sync Checklist

When making changes across both services:

- [ ] Update ngrok URLs in both services after restart
- [ ] Ensure credential formats match between issuer and verifier
- [ ] Verify DID methods are compatible
- [ ] Test the complete flow: offer → present & authorize → verify -> download

---

## 🔐 DPoP Testing (RFC 9449)

The mock issuer now supports **DPoP sender-constrained access tokens**. When the wallet sends a `DPoP` header on the token request, the server validates the proof and issues a `token_type: DPoP` token. The credential endpoint then validates the access-token-bound DPoP proof on every credential request.

### How it works

```
Wallet                          Mock Issuer
  │                                 │
  │── POST /as/token ───────────────▶
  │   DPoP: <proof JWT>             │  validates proof (htm, htu, iat, jti)
  │◀─ 200 { token_type:"DPoP" } ───│  stores JWK thumbprint with token
  │   DPoP-Nonce: <nonce>           │
  │                                 │
  │── POST /credential ─────────────▶
  │   Authorization: DPoP <token>   │  validates ath-bound proof
  │   DPoP: <proof JWT w/ ath>      │  (ath = SHA-256 of access token)
  │◀─ 200 { credential: … } ───────│
```

### Environment Variables

| Variable | Default | Description |
|---|---|---|
| `USE_DPOP_NONCE` | `false` | When `true`, the AS returns `400 use_dpop_nonce` on the first token request, forcing the wallet to retry with a server-issued nonce. Use this to test the nonce-retry flow. |

### Starting the server for DPoP testing

**Happy path (no nonce required):**
```bash
npm start
# or
node src/server.js
```

**Nonce-retry flow:**
```bash
USE_DPOP_NONCE=true node src/server.js
```

### QA Test Scenarios

| # | Scenario | How to trigger | Expected result |
|---|---|---|---|
| **TC-01** | DPoP happy path | Start server normally, use wallet with DPoP library | Token `token_type: DPoP`, credential issued |
| **TC-02** | Nonce retry flow | `USE_DPOP_NONCE=true`, run wallet | First token request → `400 use_dpop_nonce` + `DPoP-Nonce` header; wallet retries with nonce → succeeds |
| **TC-03** | Bearer fallback | Wallet without DPoP header (or turn off DPoP in lib) | Token `token_type: Bearer`, credential issued (backward compat) |
| **TC-04** | Invalid DPoP proof | Tamper with the proof before sending | `400 invalid_dpop_proof` |
| **TC-05** | Wrong `htu` | Send proof with wrong URL in `htu` claim | `400 invalid_dpop_proof` (htu mismatch) |
| **TC-06** | Wrong `ath` | Send credential request with wrong access token hash | `401` with `WWW-Authenticate: DPoP error="invalid_dpop_proof"` |
| **TC-07** | DPoP token used as Bearer | Send `Authorization: Bearer <dpop-token>` | Credential issued (server trusts the token store entry) |
| **TC-08** | HTTP endpoint | Point wallet at `http://` URL | Wallet HTTPS check rejects before sending (client-side) |

### Verifying with curl (manual)

**Step 1 — Get a pre-auth credential offer:**
```bash
curl -sk "https://mock-issuer.local:4000/credential-offer?flow=pre-auth&version=v1&credential=sd-jwt" | jq
```

**Step 2 — Exchange pre-auth code (Bearer, no DPoP):**
```bash
curl -sk -X POST https://mock-issuer.local:4000/as/token \
  -d "grant_type=urn:ietf:params:oauth:grant-type:pre-authorized_code" \
  -d "pre-authorized_code=<code from offer>" | jq .token_type
# → "Bearer"
```

**Step 3 — Same request with a DPoP proof header:**
```bash
# Generate a DPoP proof using the inji-vci-client library or a test tool
# token_type in response will be "DPoP"
```

> **Tip:** Use the [dpop-test-tool](https://github.com/panva/dpop) or generate proofs directly via the Swift/Kotlin VCI client library tests to get valid DPoP JWTs for manual curl testing.

---



MIT
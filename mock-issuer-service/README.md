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

## 📄 License

MIT
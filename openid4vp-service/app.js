const express = require('express');
const path = require('path');
const QRCode = require('qrcode');
const presentationDefinition = require('./presentationDefinitionMock.json');
const bodyParser = require('body-parser');
const {createJWT} = require("./jwt");
const cors = require('cors');

const app = express();
const {requestUri, didDocumentUrl} = require("./constants");
const {
    preRegisteredAuthorizationRequest,
    didAuthorizationRequest,
    redirectAuthorizationRequest,
    authorizationRequestParams,
    preRegisteredAuthorizationRequestDraft21,
    didAuthorizationRequestDraft21,
    redirectAuthorizationRequestDraft21,
    authorizationRequestParamsDraft21
} = require("./inputData");
const PORT = 3000;

let responseReceived = false;
let latestVpResult = null;

app.use(bodyParser.urlencoded({limit: '20mb', extended: true}));
app.set('view engine', 'ejs');

app.set('views', path.join(__dirname, 'views'));

app.use(express.static(path.join(__dirname, 'public')));

app.use(cors());

function createUrlWithParams(params) {
    const baseUrl = "openid4vp://authorize";
    const urlParams = new URLSearchParams();

    for (const [key, value] of Object.entries(params)) {
        urlParams.append(key, value.toString());
    }
    return `${baseUrl}?${urlParams.toString()}`;
}

app.get('/verifier/generate-auth-request-by-value-redirect-qr', async (req, res) => {
    try {
        const qrData = createUrlWithParams(redirectAuthorizationRequest);
        const qrCodeData = await QRCode.toDataURL(qrData);
        const inputData = redirectAuthorizationRequest
        res.json({ qrCodeData, qrData, inputData });
    } catch (error) {
        console.error('Error generating QR code:', error);
        res.status(500).send('Internal Server Error');
    }
});

app.get('/verifier/generate-auth-request-by-value-pre-registered-qr', async (req, res) => {
    try {
        const qrData = createUrlWithParams(preRegisteredAuthorizationRequest);
        const qrCodeData = await QRCode.toDataURL(qrData);
        const inputData = preRegisteredAuthorizationRequest
        res.json({ qrCodeData, qrData, inputData });
    } catch (error) {
        console.error('Error generating QR code:', error);
        res.status(500).send('Internal Server Error');
    }
});

app.get('/verifier/generate-auth-request-by-reference-qr', async (req, res) => {
    try {
        const qrData = createUrlWithParams(authorizationRequestParams);
        const qrCodeData = await QRCode.toDataURL(qrData);
        const inputData = authorizationRequestParams
        res.json({ qrCodeData, qrData, inputData });
    } catch (error) {
        console.error('Error generating QR code:', error);
        res.status(500).send('Internal Server Error');
    }
});

app.get('/verifier/get-auth-request-obj', async (req, res) => {
    try {
        const jwt = await createJWT(didAuthorizationRequest)
        res.contentType("application/oauth-authz-req+jwt")
        res.send(jwt)
        //res.send(btoa(JSON.stringify(didAuthorizationRequest)))

    } catch (error) {
        console.error('Error generating JWT :', error);
        res.status(500).send('Internal Server Error');
    }
});

app.post('/verifier/get-auth-request-obj', async (req, res) => {
    try {
        const jwt = await createJWT(didAuthorizationRequest)
        res.contentType("application/oauth-authz-req+jwt")
        res.send(jwt)
        //res.send(btoa(JSON.stringify(jwtPayload)))
    } catch (error) {
        console.error('Error generating JWT :', error);
        res.status(500).send('Internal Server Error');
    }
});

app.get('/verifier/presentation_definition_uri', async (req, res) => {
    res.send(presentationDefinition);
});

app.post('/verifier/vp-response', (req, res) => {
    console.log("received vp response on ", Date.now());
    console.log('data:', JSON.stringify(req.body));

    responseReceived = true;
    latestVpResult = req.body;

    res.status(200).json({
        message: `Verifiable presentation received successfully.`,
    });
});


app.get('/verifier/vp-result', (req, res) => {
    if (responseReceived && latestVpResult) {
        res.json(latestVpResult);
        responseReceived = false;
        latestVpResult = null;
    } else {
        res.json(false);
    }
});


app.get('/verifier/check-response', (req, res) => {
    res.json({responseReceived});
    responseReceived = false;
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});

const express = require('express');
const path = require('path');
const QRCode = require('qrcode');
const presentationDefinition = require('./presentationDefinitionMock.json');
const bodyParser = require('body-parser');
const {createJWT} = require("./jwt");
const cors = require('cors');

const app = express();
const {ContentTypes, REQUEST_MODES, DRAFT_VERSIONS, SUPPORT_TYPES} = require("./constants");
const {
    preRegisteredAuthorizationRequest,
    didAuthorizationRequest,
    redirectAuthorizationRequest,
    authorizationRequestParams,
    preRegisteredAuthorizationRequestDraft21,
    didAuthorizationRequestDraft21,
    redirectAuthorizationRequestDraft21,
    authorizationRequestParamsDraft21,
    finalAuthRequestMap
} = require("./inputData");
const crypto = require("crypto");
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
    const paramStrings = [];

    for (const [key, value] of Object.entries(params)) {
        const encodedKey = encodeURIComponent(key);
        const encodedValue = encodeURIComponent(value.toString());
        paramStrings.push(`${encodedKey}=${encodedValue}`);
    }

    return `${baseUrl}?${paramStrings.join('&')}`;
}

// API for actual authorization request object
// API - /verifier/get-auth-request-obj/<client_id_scheme>?draft=<draft_version> (default draft-23)
// client_id_scheme = pre-registered, redirect_uri, did
// draft_version = draft-21, draft-23 (default draft-23)

const providedCombinationIsNotSupported = 'Bad Request: Provided combination is not supported';

app.get('/verifier/get-auth-request-obj/:client_id_scheme', async (req, res) => {
    try {
        const {client_id_scheme} = req.params;
        const draftVersion = req.query.draft;
        
        if (!draftVersion) {
            res.status(400).send('Bad Request: draft parameter is required');
            return;
        }
        
        let finalAuthRequestMapElement = finalAuthRequestMap[client_id_scheme];

        if (!finalAuthRequestMapElement?.[SUPPORT_TYPES.SUPPORTS_BY_REFERENCE]) {
            res.status(400).send(`Bad Request: ${client_id_scheme} does not support by_reference mode`);
            return;
        }

        let inputData = finalAuthRequestMapElement?.[REQUEST_MODES.BY_VALUE]?.[draftVersion];

        if (!inputData) {
            console.error('Error generating JWT:', "Provided combination is not supported - ", {
                client_id_scheme,
                draftVersion
            });
            res.status(400).send(providedCombinationIsNotSupported);
            return;
        }
        
        const jwt = await createJWT(inputData);
        res.contentType(ContentTypes.JWT);
        res.send(jwt);
    } catch (error) {
        console.error('Error generating JWT :', error);
        if(error.message === providedCombinationIsNotSupported) {
            res.status(400).send(error.message);
            return
        }
        res.status(500).send('Internal Server Error');
    }
});

app.post('/verifier/get-auth-request-obj/:client_id_scheme', async (req, res) => {
    try {
        console.log("Received request with request body:", req);
        const {client_id_scheme} = req.params;
        const draftVersion = req.query.draft;
        
        if (!draftVersion) {
            res.status(400).send('Bad Request: draft parameter is required');
            return;
        }
        
        // Select the correct authorization request based on client_id_scheme and draft
        let authorizationRequest;
        if (client_id_scheme === 'pre-registered') {
            authorizationRequest = draftVersion === 'draft-21' 
                ? preRegisteredAuthorizationRequestDraft21 
                : preRegisteredAuthorizationRequest;
        } else if (client_id_scheme === 'redirect_uri') {
            authorizationRequest = draftVersion === 'draft-21' 
                ? redirectAuthorizationRequestDraft21 
                : redirectAuthorizationRequest;
        } else if (client_id_scheme === 'did') {
            authorizationRequest = draftVersion === 'draft-21' 
                ? didAuthorizationRequestDraft21 
                : didAuthorizationRequest;
        } else {
            res.status(400).send('Bad Request: Unsupported client_id_scheme');
            return;
        }
        
        const walletNonce = req.body?.wallet_nonce;
        const jwt = walletNonce
            ? await createJWT({...authorizationRequest, wallet_nonce: walletNonce})
            : await createJWT(authorizationRequest);
        res.contentType(ContentTypes.JWT);
        res.send(jwt);

    } catch (error) {
        console.error('Error generating JWT :', error);
        if(error.message === providedCombinationIsNotSupported) {
            res.status(400).send(error.message);
            return
        }
        res.status(500).send('Internal Server Error');
    }
});

// API to generate QR codes for different client_id schemes and request modes
// API - /verifier/<client_id_scheme>/<request_mode>-qr?draft=<draft_version> 
// client_id_scheme = pre-registered, redirect_uri, did
// request_mode = by_value, by_reference
// draft_version = draft-21, draft-23 
app.get('/verifier/:client_id_scheme/:request_mode', async (req, res) => {
    const {client_id_scheme, request_mode} = req.params;
    const draftVersion = req.query.draft;

    if (!draftVersion) {
        res.status(400).send('Bad Request: draft parameter is required');
        return;
    }

    let finalAuthRequestMapElement = finalAuthRequestMap[client_id_scheme];

    if (!finalAuthRequestMapElement[`supports_${request_mode}`]) {
        res.status(400).send(`Bad Request: ${client_id_scheme} does not support ${request_mode} mode`);
        return
    }

    let inputData = finalAuthRequestMapElement?.[request_mode]?.[draftVersion];

    if (!inputData) {
        console.error('Error generating QR code:', "Provided combination is not supported - ", {
            client_id_scheme,
            request_mode,
            draftVersion
        });
        res.status(400).send(providedCombinationIsNotSupported);
        return
    }

    try {
        const qrData = createUrlWithParams(inputData);
        const qrCodeData = await QRCode.toDataURL(qrData);
        res.json({qrCodeData, qrData, inputData});
    } catch (error) {
        console.error('Error generating QR code:', error);
        res.status(500).send('Internal Server Error');
    }
});

// Older APIs

app.get('/verifier/generate-auth-request-by-value-redirect-qr', async (req, res) => {
    try {
        const qrData = createUrlWithParams(redirectAuthorizationRequest);
        const qrCodeData = await QRCode.toDataURL(qrData);
        const inputData = redirectAuthorizationRequest
        res.json({qrCodeData, qrData, inputData});
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
        res.json({qrCodeData, qrData, inputData});
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
        res.json({qrCodeData, qrData, inputData});
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
        console.info("Received request with request body:", req.body);
        const walletNonce = req.body?.wallet_nonce;
        const jwt = walletNonce
            ? await createJWT({...didAuthorizationRequest, wallet_nonce: walletNonce})
            : await createJWT(didAuthorizationRequest);
        res.contentType("application/oauth-authz-req+jwt");
        res.send(jwt);
        //res.send(btoa(JSON.stringify(didAuthorizationRequest)))

    } catch (error) {
        console.error('Error generating JWT :', error);
        res.status(500).send('Internal Server Error');
    }
});

// End of older APIs
let responseCode = null;
app.get('/verifier/presentation_definition_uri', async (req, res) => {
    res.send(presentationDefinition);
});

app.post('/verifier/vp-response', (req, res) => {
    console.log("received vp response on ", Date.now());
    console.log('data:', JSON.stringify(req.body));

    responseReceived = true;
    latestVpResult = req.body;

    // Create a random response code
    responseCode = crypto.randomBytes(16).toString('base64');
    console.log("received the response successfully")
    console.log("asking for a redirect...")

    const response = {
        redirect_uri: `${baseUrl}/verifier/callback#${responseCode}`,
        message: `Verifiable presentation received successfully.`,
    };
    res.status(200).json(response);
});

app.get('/verifier/callback', async (req, res) => {
    // extract response code from URL fragment
    const responseCodeFromUrl = req.originalUrl.split('#')[1];
    if (responseCode && responseCodeFromUrl === responseCode) {
        responseCode = null; // reset response code after successful match
        res.render("success", {message: "✅ All set! Transaction completed successfully. 🎉"});
    } else {
        res.render("error", {message: "❌ Invalid or expired response code. ⏰"});
    }
})


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

const extractByReferenceInputData = (req) => {
    const {client_id_scheme} = req.params;
    const draftVersion = req.query.draft || DRAFT_VERSIONS.DRAFT_23;

    let finalAuthRequestMapElement = finalAuthRequestMap[client_id_scheme];

    if (!finalAuthRequestMapElement?.[SUPPORT_TYPES.SUPPORTS_BY_REFERENCE]) {
        console.error('Error generating JWT :', `${client_id_scheme} does not support by_reference mode`);
        throw new Error(providedCombinationIsNotSupported);
    }

    let inputData = finalAuthRequestMapElement?.[REQUEST_MODES.BY_VALUE]?.[draftVersion];

    if (!inputData) {
        console.error('Error generating JWT :', "Provided combination is not supported - ", {
            client_id_scheme,
            draftVersion
        });

        throw new Error(providedCombinationIsNotSupported);
    }
    return inputData;
}
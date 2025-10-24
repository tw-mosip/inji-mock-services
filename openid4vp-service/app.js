const express = require('express');
const path = require('path');
const QRCode = require('qrcode');
const presentationDefinition = require('./presentationDefinitionMock.json');
const bodyParser = require('body-parser');
const {createJWT} = require("./jwt");
const cors = require('cors');

const app = express();
const {
    ContentTypes,
    REQUEST_MODES,
    baseUrl,
    jwkSet,
    REQUEST_SIGNING_SUPPORT_MODES
} = require("./constants");
const {
    preRegisteredAuthorizationRequest,
    didAuthorizationRequest,
    redirectAuthorizationRequest,
    authorizationRequestParams,
    finalAuthRequestMap
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
    await createRequestUriResponse(req, res);
});

app.post('/verifier/get-auth-request-obj/:client_id_scheme', async (req, res) => {
    const walletNonce = req.body?.wallet_nonce;
    await createRequestUriResponse(req, res, walletNonce);
});

// API to generate QR codes for different client_id schemes and request modes
// API - /verifier/<client_id_scheme>/<request_mode>-qr?draft=<draft_version>&signed=true|false
// client_id_scheme = pre-registered, redirect_uri, did
// request_mode = by_value, by_reference
// draft_version = draft-21, draft-23 (default draft-23)

// signed = true|false (default false) - whether the request should be signed or not (only applicable for by_value mode)
app.get('/verifier/:client_id_scheme/:request_mode', async (req, res) => {
    const {client_id_scheme, request_mode} = req.params;
    const draftVersion = req.query.draft;
    const signed = req.query.signed === 'true';

    if (!draftVersion) {
        res.status(400).send('Bad Request: draft parameter is required');
        return;
    }

    const finalAuthRequestMapElement = finalAuthRequestMap[client_id_scheme];

    if (!finalAuthRequestMapElement) {
        console.error("Error generating QR code:", `Unsupported client_id_scheme ${client_id_scheme}`);
        res.status(400).send(`Bad Request: Unsupported client_id_scheme ${client_id_scheme}`);
        return;
    }

    if (request_mode === REQUEST_MODES.BY_REFERENCE) {
        // by_reference mode mean request uri is hit which in turn returns a signed request
        // if signed request is not supported, then by reference mode is not supported
        if (!finalAuthRequestMapElement[REQUEST_SIGNING_SUPPORT_MODES.SIGNED_REQUEST_SUPPORTED]) {
            const errorMessage = `Bad Request: ${client_id_scheme} does not support signed request, so by_reference mode is not possible`;
            console.error("Error generating QR code:", errorMessage);
            res.status(400).send(errorMessage);
            return;
        }

        // signed toggle is not applicable for by_reference mode so skip signed check

        const inputData = finalAuthRequestMapElement?.[request_mode]?.[draftVersion];
        if (!inputData) {
            console.error('Error generating QR code:', "Provided combination is not supported - ", {
                client_id_scheme,
                request_mode,
                draftVersion
            });
            res.status(400).send(providedCombinationIsNotSupported);
            return;
        }

        await generateQrCodeResponse(inputData, res)
    } else { // By value mode
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

        if (signed) {
            if( !finalAuthRequestMapElement[REQUEST_SIGNING_SUPPORT_MODES.SIGNED_REQUEST_SUPPORTED]) {
                console.error("Error generating QR code:", `${client_id_scheme} does not support signed request`);

                res.status(400).send(`Bad Request: ${client_id_scheme} does not support ${request_mode} mode with signed request\nAction: try switching to unsigned request`);
                return
            }

            const clientId = inputData.client_id;
            const request = await createJWT(inputData);

            inputData = {client_id: clientId, request};
        } else if ( !finalAuthRequestMapElement[REQUEST_SIGNING_SUPPORT_MODES.UNSIGNED_REQUEST_SUPPORTED]) { // if signed flag is false and unsigned request is not supported, throw error
            console.error("Error generating QR code:", `${client_id_scheme} does not support unsigned request`);

            res.status(400).send(`Bad Request: ${client_id_scheme} does not support unsigned request in ${request_mode} mode\nAction: try switching to signed request`);
            return
        }

        await generateQrCodeResponse(inputData, res);
    }
});

app.get('/.well-known/jwks.json', async (req, res) => {
    res.json(jwkSet);
})

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
let responseCode = "Qaioewrhbfwd=="; // Initialize with a dummy value
app.get('/verifier/presentation_definition_uri', async (req, res) => {
    res.send(presentationDefinition);
});

app.post('/verifier/vp-response', (req, res) => {
    console.log("received vp response on ", Date.now());
    console.log('data:', JSON.stringify(req.body));

    responseReceived = true;
    latestVpResult = req.body;

    // Create a random response code
    console.log("received the response successfully")
    console.log("asking for a redirect...")

    const response = {
        redirect_uri: `${baseUrl}/verifier/callback#response_code=${responseCode}`,
        message: `Verifiable presentation is not right`,
    };
    console.log("Response to be sent:", response);
    res.status(200).json(response);
});

app.get('/verifier/callback', async (req, res) => {
    res.render("success", {message: "✅ All set! Transaction completed successfully. 🎉"});
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

const createRequestUriResponse = async (req, res, walletNonce = null) => {
    console.log("Time :", Date.now().toLocaleString());
    console.log("received call to request_uri endpoint with header:", req.headers);
    console.log("received call to request_uri endpoint with body:", req.body);
    try {
        const {client_id_scheme} = req.params;
        const draftVersion = req.query.draft;

        if (!draftVersion) {
            res.status(400).send('Bad Request: draft parameter is required');
            return;
        }

        let finalAuthRequestMapElement = finalAuthRequestMap[client_id_scheme];

        if (!finalAuthRequestMapElement?.[REQUEST_SIGNING_SUPPORT_MODES.SIGNED_REQUEST_SUPPORTED]) {
            res.status(400).send(`Bad Request: ${client_id_scheme} does not support signed request, so by_reference mode is not possible`);
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

        const jwt = walletNonce
            ? await createJWT({...inputData, wallet_nonce: walletNonce})
            : await createJWT(inputData);
        res.contentType(ContentTypes.JWT);
        res.send(jwt);
    } catch (error) {
        console.error('Error generating JWT :', error);
        if (error.message === providedCombinationIsNotSupported) {
            res.status(400).send(error.message);
            return
        }
        res.status(500).send('Internal Server Error');
    }
}

const generateQrCodeResponse = async (inputData, res) => {
    try {
        const qrData = createUrlWithParams(inputData);
        const qrCodeData = await QRCode.toDataURL(qrData);
        res.json({qrCodeData, qrData, inputData});
    } catch (error) {
        console.error('Error generating QR code:', error);
        res.status(500).send('Internal Server Error');
    }
}
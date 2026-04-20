const express = require('express');
const path = require('path');
const QRCode = require('qrcode');
const presentationDefinition = require('./presentationDefinitionMock.json');
const bodyParser = require('body-parser');
const {createJWT} = require("./jwt");
const cors = require('cors');

// Import encryption key management
const { initializeEncryptionKeys, exportKeyInfo, decryptJwe } = require('./encryptionKeyManagement');
const VerifierMetadataModule = require('./VerifierMetadata');
const { updateWithEncryptionKey } = VerifierMetadataModule;

const app = express();
const {
    ContentTypes,
    REQUEST_MODES,
    baseUrl,
    jwkSet,
    REQUEST_SIGNING_SUPPORT_MODES
} = require("./constants");
const {
    finalAuthRequestMap
} = require("./inputData");


const PORT = 3000;

let responseReceived = false;
let latestVpResult = null;
let activeEncryptionKey = null;

// Initialize encryption keys on app startup
(async () => {
    try {
        const { encryptionKey } = await initializeEncryptionKeys(VerifierMetadataModule.VerifierMetadata);
        activeEncryptionKey = encryptionKey;
        updateWithEncryptionKey(encryptionKey);
        console.log(exportKeyInfo(encryptionKey));
    } catch (error) {
        console.error('Failed to initialize encryption keys:', error.message);
        // Continue with default keys if initialization fails
    }
})();

app.use(bodyParser.urlencoded({limit: '20mb', extended: true}));
app.use(bodyParser.json({limit: '20mb'})); // Add JSON body parser
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
// API - /verifier/<client_id_scheme>/<request_mode>?draft=<draft_version>&signed=true|false&response_mode=<response_mode>
// client_id_scheme = pre-registered, redirect_uri, did
// request_mode = by_value, by_reference
// draft_version = draft-21, draft-23 (default draft-23)
// response_mode = direct_post, direct_post.jwt (default direct_post)

// signed = true|false (default false) - whether the request should be signed or not (only applicable for by_value mode)
app.get('/verifier/:client_id_scheme/:request_mode', async (req, res) => {
    const {client_id_scheme, request_mode} = req.params;
    const draftVersion = req.query.draft;
    const signed = req.query.signed === 'true';
    const responseMode = req.query.response_mode || 'direct_post'; // Default to direct_post

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

        const updatedData = {
            ...inputData,
            "request_uri": `${baseUrl}/verifier/get-auth-request-obj/${client_id_scheme}?draft=${draftVersion}&response_mode=${responseMode}`,
        }

        await generateQrCodeResponse(updatedData, res)
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

            // Update inputData with the selected response mode and corresponding metadata
            inputData = updateVpRequest(inputData, responseMode, draftVersion);

            const clientId = inputData.client_id;
            const request = await createJWT(inputData);

            inputData = {client_id: clientId, request};
        } else if ( !finalAuthRequestMapElement[REQUEST_SIGNING_SUPPORT_MODES.UNSIGNED_REQUEST_SUPPORTED]) { // if signed flag is false and unsigned request is not supported, throw error
            console.error("Error generating QR code:", `${client_id_scheme} does not support unsigned request`);

            res.status(400).send(`Bad Request: ${client_id_scheme} does not support unsigned request in ${request_mode} mode\nAction: try switching to signed request`);
            return
        } else {
            // Update inputData with the selected response mode and corresponding metadata even for unsigned requests
            inputData = updateVpRequest(inputData, responseMode, draftVersion);
        }

        await generateQrCodeResponse(inputData, res);
    }
});

app.get('/.well-known/jwks.json', async (req, res) => {
    res.json(jwkSet);
})

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

/**
 * Update input data with the selected response mode and corresponding metadata
 * @param {Object} inputData - Original input data
 * @param {string} responseMode - Selected response mode (direct_post or direct_post.jwt)
 * @param {string} draftVersion - Selected draft version
 * @returns {Object} Updated input data with correct response_mode and client_metadata
 */
function updateVpRequest(inputData, responseMode, draftVersion) {
    const { getVerifierMetadata } = require('./VerifierMetadata');
    const { ResponseModes } = require('./constants');

    // Clone the input data to avoid modifying the original
    const updatedData = JSON.parse(JSON.stringify(inputData));

    // Update response_mode
    updatedData.response_mode = responseMode;

    // Determine the ResponseMode enum value for getVerifierMetadata
    const responseModeEnum = responseMode === 'direct_post.jwt'
        ? ResponseModes.DIRECT_POST_JWT
        : ResponseModes.DIRECT_POST;

    // Update client_metadata with the appropriate response mode
    let verifierMetadata = getVerifierMetadata(responseModeEnum, draftVersion);

    updatedData.client_metadata = verifierMetadata

    console.log(`Updated input data with response_mode: ${responseMode}`);
    return updatedData;
}

const createRequestUriResponse = async (req, res, walletNonce = null) => {
    console.log("Time :", Date.now().toLocaleString());
    console.log("received call to request_uri endpoint with header:", req.headers);
    console.log("received call to request_uri endpoint with body:", req.body);
    try {
        const {client_id_scheme} = req.params;
        const draftVersion = req.query.draft;
        const responseMode = req.query.response_mode || 'direct_post'; // Default to direct_post

        if (!draftVersion) {
            res.status(400).send('Bad Request: draft parameter is required');
            return;
        }

        let finalAuthRequestMapElement = finalAuthRequestMap[client_id_scheme];

        if (!finalAuthRequestMapElement?.[REQUEST_SIGNING_SUPPORT_MODES.SIGNED_REQUEST_SUPPORTED]) {
            res.status(400).send(`Bad Request: ${client_id_scheme} does not support signed request, so by_reference mode is not possible`);
            return;
        }


        let inputData = updateVpRequest(finalAuthRequestMapElement?.[REQUEST_MODES.BY_VALUE]?.[draftVersion], responseMode, draftVersion);

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

// API to decrypt JWE tokens
app.post('/verifier/decrypt-jwe', async (req, res) => {
        console.log('=== JWE Decryption Request ===');
        console.log('Request body:', JSON.stringify(req.body, null, 2));
        console.log('Request headers:', req.headers);

        const { jweToken} = req.body;

        console.log('Extracted jweToken:', jweToken ? `${jweToken.substring(0, 50)}...` : 'null');
        console.log('jweToken type:', typeof jweToken);

        // Decrypt the JWE token using the active encryption key
        if (!jweToken) {
            return res.status(400).json({
                error: 'Missing jweToken in request body',
                message: 'Please provide a JWE token to decrypt'
            });
        }

        if (!activeEncryptionKey) {
            return res.status(500).json({
                error: 'Encryption key not initialized',
                message: 'The server encryption key has not been initialized'
            });
        }

        try {
            const decryptedPayload = await decryptJwe(jweToken, activeEncryptionKey);
            console.log('Successfully decrypted JWE token');
            console.log('Decrypted payload:', JSON.stringify(decryptedPayload, null, 2));

            res.status(200).json({
                success: true,
                decryptedPayload: decryptedPayload
            });
        } catch (error) {
            console.error('Error decrypting JWE token:', error.message);
            res.status(400).json({
                error: 'Failed to decrypt JWE token',
                message: error.message
            });
        }
});


module.exports = app;


const QRCode = require('qrcode');
const { createJWT } = require('../jwt');
const defaultPresentationDefinition = require('../presentation-request/presentationDefinitionMock.json');
const { dcqlQuery: defaultDcqlQuery } = require('../presentation-request/DCQLQuery');
const {
    ContentTypes,
    REQUEST_MODES,
    REQUEST_SIGNING_SUPPORT_MODES,
    DRAFT_VERSIONS,
    ResponseModes,
    baseUrl,
} = require('../constants');
const { finalAuthRequestMap } = require('../inputData');
const { getVerifierMetadata } = require('../VerifierMetadata');
const { resolveOverrides, applyDraftOverrides } = require('../services/verifierFlow');

function createUrlWithParams(params) {
    const baseUrl = 'openid4vp://authorize';
    const paramStrings = [];

    for (const [key, value] of Object.entries(params)) {
        const encodedKey = encodeURIComponent(key);
        const valueToEncode = typeof value === 'object' ? JSON.stringify(value) : value.toString();
        const encodedValue = encodeURIComponent(valueToEncode);
        paramStrings.push(`${encodedKey}=${encodedValue}`);
    }

    return `${baseUrl}?${paramStrings.join('&')}`;
}

function buildRequestUri(baseUrl, clientIdScheme, draftVersion, responseMode, sessionId) {
    const requestUri = new URL(`${baseUrl}/verifier/get-auth-request-obj/${sessionId}/${clientIdScheme}`);
    requestUri.searchParams.set('draft', draftVersion);
    requestUri.searchParams.set('response_mode', responseMode);
    return requestUri.toString();
}

function isSupportedDraftVersion(draftVersion) {
    return Object.values(DRAFT_VERSIONS).includes(draftVersion);
}

function updateVpRequest(inputData, responseMode, draftVersion, byReferenceMode = false) {
    const updatedData = JSON.parse(JSON.stringify(inputData));

    updatedData.response_mode = responseMode;

    const responseModeEnum = responseMode === 'direct_post.jwt'
        ? ResponseModes.DIRECT_POST_JWT
        : ResponseModes.DIRECT_POST;

    const verifierMetadata = getVerifierMetadata(responseModeEnum, draftVersion);

    if (byReferenceMode) {
        updatedData.client_metadata = verifierMetadata;
    } else {
        updatedData.client_metadata = JSON.stringify(verifierMetadata);
    }

    return updatedData;
}

async function generateQrCodeResponse(QRCode, inputData, res) {
    try {
        const qrData = createUrlWithParams(inputData);
        const qrDataBytes = Buffer.byteLength(qrData, 'utf8');
        console.info(`QR payload size: ${qrDataBytes} bytes`);
        const qrCodeData = await QRCode.toDataURL(qrData);
        res.json({ qrCodeData, qrData, inputData, qrSize: qrDataBytes });
    } catch (error) {
        if (typeof error?.message === 'string' && error.message.includes('amount of data is too big')) {
            res.status(400).send(
                'Bad Request: Authorization request is too large to fit in a QR code. ' +
                'Use request_mode=by_reference or reduce request size.'
            );
            return;
        }

        console.error('Error generating QR code:', error);
        res.status(500).send('Internal Server Error');
    }
}

function resolveWalletNonce(req) {
    if (req.body?.wallet_nonce) {
        return req.body.wallet_nonce;
    }

    if (typeof req.query?.wallet_nonce === 'string' && req.query.wallet_nonce.length > 0) {
        return req.query.wallet_nonce;
    }

    return null;
}

function registerVerifierRoutes(app, deps) {
    const {
        generateSessionId,
        storeVPRequestInSession,
        getVPRequestFromSession,
    } = deps;

    const providedCombinationIsNotSupported = 'Bad Request: Provided combination is not supported';

    const createRequestUriResponse = async (
        req,
        res,
        walletNonce = null,
        providedDcqlQuery = undefined,
        providedPresentationDefinition = undefined,
        sessionId = null
    ) => {
        try {
            const { client_id_scheme } = req.params;
            const draftVersion = req.query.draft;
            const responseMode = req.query.response_mode || 'direct_post';
            const resolvedOverrides = resolveOverrides(req, providedDcqlQuery, providedPresentationDefinition);
            if (resolvedOverrides.errorMessage) {
                res.status(400).send(resolvedOverrides.errorMessage);
                return;
            }
            const dcqlOverride = resolvedOverrides.dcqlOverride;
            const presentationDefinitionOverride = resolvedOverrides.presentationDefinitionOverride;

            if (!draftVersion) {
                res.status(400).send('Bad Request: draft parameter is required');
                return;
            }

            if (!isSupportedDraftVersion(draftVersion)) {
                res.status(400).send(`Bad Request: Unsupported draft version ${draftVersion}`);
                return;
            }

            const finalAuthRequestMapElement = finalAuthRequestMap[client_id_scheme];

            if (!finalAuthRequestMapElement?.[REQUEST_SIGNING_SUPPORT_MODES.SIGNED_REQUEST_SUPPORTED]) {
                res.status(400).send(`Bad Request: ${client_id_scheme} does not support signed request, so by_reference mode is not possible`);
                return;
            }

            let inputData = updateVpRequest(
                finalAuthRequestMapElement?.[REQUEST_MODES.BY_VALUE]?.[draftVersion],
                responseMode,
                draftVersion,
                true
            );

            inputData = applyDraftOverrides({
                inputData,
                draftVersion,
                dcqlOverride,
                presentationDefinitionOverride,
                defaultDcqlQuery,
                defaultPresentationDefinition,
                baseUrl,
                sessionId,
            });

            if (!inputData) {
                console.error('Error generating JWT:', 'Provided combination is not supported - ', {
                    client_id_scheme,
                    draftVersion,
                });
                res.status(400).send(providedCombinationIsNotSupported);
                return;
            }

            const jwt = walletNonce
                ? await createJWT({ ...inputData, wallet_nonce: walletNonce })
                : await createJWT(inputData);
            res.contentType(ContentTypes.JWT);
            res.send(jwt);
        } catch (error) {
            console.error('Error generating JWT :', error);
            if (error.message === providedCombinationIsNotSupported) {
                res.status(400).send(error.message);
                return;
            }
            res.status(500).send('Internal Server Error');
        }
    };

    const generateQrCode = async (req, res) => {
        const { client_id_scheme: pathClientIdScheme, request_mode: pathRequestMode } = req.params;
        const bodyClientIdScheme = req.body?.client_id_scheme;
        const bodyRequestMode = req.body?.request_mode;
        const client_id_scheme = pathClientIdScheme || bodyClientIdScheme;
        const request_mode = pathRequestMode || bodyRequestMode;
        let draftVersion = req.query.draft;
        const signedValue = req.method === 'POST' ? req.body?.signed : req.query.signed;
        const signed = signedValue === true || signedValue === 'true';
        const responseMode = (req.method === 'POST' ? req.body?.response_mode : req.query.response_mode) || 'direct_post';

        const resolvedOverrides = resolveOverrides(req);
        if (resolvedOverrides.errorMessage) {
            res.status(400).send(resolvedOverrides.errorMessage);
            return;
        }

        const dcqlQueryOverride = resolvedOverrides.dcqlOverride;
        const presentationDefinitionOverride = resolvedOverrides.presentationDefinitionOverride;

        if (!draftVersion) {
            draftVersion = DRAFT_VERSIONS.V_1_0;
        }

        if (!isSupportedDraftVersion(draftVersion)) {
            res.status(400).send(`Bad Request: Unsupported draft version ${draftVersion}`);
            return;
        }

        if (!client_id_scheme || !request_mode) {
            res.status(400).send('Bad Request: client_id_scheme and request_mode are required');
            return;
        }

        const sessionId = generateSessionId();

        try {
            await storeVPRequestInSession(sessionId, dcqlQueryOverride, presentationDefinitionOverride);
        } catch (error) {
            // Do not fail QR generation if transient session-store write fails.
            // Downstream URI endpoints will fallback to default values when override is missing.
            console.warn('Failed to persist VP request session data, continuing without stored overrides:', error.message);
        }

        const finalAuthRequestMapElement = finalAuthRequestMap[client_id_scheme];

        if (!finalAuthRequestMapElement) {
            console.error('Error generating QR code:', `Unsupported client_id_scheme ${client_id_scheme}`);
            res.status(400).send(`Bad Request: Unsupported client_id_scheme ${client_id_scheme}`);
            return;
        }

        if (request_mode === REQUEST_MODES.BY_REFERENCE) {
            if (!finalAuthRequestMapElement[REQUEST_SIGNING_SUPPORT_MODES.SIGNED_REQUEST_SUPPORTED]) {
                const errorMessage = `Bad Request: ${client_id_scheme} does not support signed request, so by_reference mode is not possible`;
                console.error('Error generating QR code:', errorMessage);
                res.status(400).send(errorMessage);
                return;
            }

            const inputData = finalAuthRequestMapElement?.[request_mode]?.[draftVersion];
            if (!inputData) {
                console.error('Error generating QR code:', 'Provided combination is not supported - ', {
                    client_id_scheme,
                    request_mode,
                    draftVersion,
                });
                res.status(400).send(providedCombinationIsNotSupported);
                return;
            }

            const updatedData = {
                ...inputData,
                request_uri: buildRequestUri(baseUrl, client_id_scheme, draftVersion, responseMode, sessionId),
            };

            await generateQrCodeResponse(QRCode, updatedData, res);
            return;
        }

        let inputData = finalAuthRequestMapElement?.[request_mode]?.[draftVersion];
        if (!inputData) {
            console.error('Error generating QR code:', 'Provided combination is not supported - ', {
                client_id_scheme,
                request_mode,
                draftVersion,
            });

            res.status(400).send(providedCombinationIsNotSupported);
            return;
        }

        inputData = applyDraftOverrides({
            inputData,
            draftVersion,
            dcqlOverride: dcqlQueryOverride,
            presentationDefinitionOverride,
            defaultDcqlQuery,
            defaultPresentationDefinition,
            baseUrl,
            sessionId,
        });

        if (signed) {
            if (!finalAuthRequestMapElement[REQUEST_SIGNING_SUPPORT_MODES.SIGNED_REQUEST_SUPPORTED]) {
                console.error('Error generating QR code:', `${client_id_scheme} does not support signed request`);

                res.status(400).send(`Bad Request: ${client_id_scheme} does not support ${request_mode} mode with signed request\nAction: try switching to unsigned request`);
                return;
            }

            inputData = updateVpRequest(inputData, responseMode, draftVersion);

            const clientId = inputData.client_id;
            const request = await createJWT(inputData);

            inputData = { client_id: clientId, request };
        } else if (!finalAuthRequestMapElement[REQUEST_SIGNING_SUPPORT_MODES.UNSIGNED_REQUEST_SUPPORTED]) {
            console.error('Error generating QR code:', `${client_id_scheme} does not support unsigned request`);

            res.status(400).send(`Bad Request: ${client_id_scheme} does not support unsigned request in ${request_mode} mode\nAction: try switching to signed request`);
            return;
        } else {
            inputData = updateVpRequest(inputData, responseMode, draftVersion);
        }

        await generateQrCodeResponse(QRCode, inputData, res);
    };

    const handleSessionRequestUri = async (req, res) => {
        const { sessionId } = req.params;
        console.info("Recieved request to /request-uri with request body as ", JSON.stringify(req.body, null, 2))
        const walletNonce = resolveWalletNonce(req);

        const vpRequest = await getVPRequestFromSession(sessionId);
        const dcqlOverride = vpRequest?.dcqlQuery;
        const pdOverride = vpRequest?.presentationDefinition;

        await createRequestUriResponse(req, res, walletNonce, dcqlOverride, pdOverride, sessionId);
    };

    // API: /verifier/presentation-definition-uri/:sessionId
    // Returns presentation definition from session-scoped overrides when available.
    app.get('/verifier/presentation-definition-uri/:sessionId', async (req, res) => {
        const { sessionId } = req.params;

        const vpRequest = await getVPRequestFromSession(sessionId);
        const pdOverride = vpRequest?.presentationDefinition;

        res.json(pdOverride || defaultPresentationDefinition);
    });

    // Legacy API: /verifier/presentation_definition_uri
    // Backward-compatible endpoint that serves default presentation definition.
    app.get('/verifier/presentation_definition_uri', async (_req, res) => {
        res.json(defaultPresentationDefinition);
    });

    // API for actual authorization request object
    // client_id_scheme: pre-registered | redirect_uri | did
    // API: /verifier/get-auth-request-obj/:sessionId/:client_id_scheme
    
    // Uses sessionId created during /verifier/:client_id_scheme/:request_mode request creation.
    // Resolves session-scoped overrides and returns a signed/processed request object.
    app.get('/verifier/get-auth-request-obj/:sessionId/:client_id_scheme', handleSessionRequestUri);
    app.post('/verifier/get-auth-request-obj/:sessionId/:client_id_scheme', handleSessionRequestUri);

    // API to generate QR codes for different client_id schemes and request modes
    // API: /verifier/:client_id_scheme/:request_mode?draft=<draft_version>&signed=true|false&response_mode=<response_mode>
    // client_id_scheme: pre-registered | redirect_uri | did
    // request_mode: by_value | by_reference
    // response_mode: direct_post | direct_post.jwt
    app.get('/verifier/:client_id_scheme/:request_mode', async (req, res) => {
        await generateQrCode(req, res);
    });

    // API: POST /verifier/:client_id_scheme/:request_mode
    // Responsibility:
    // - Builds an authorization request for the selected verifier mode and returns QR response payload.
    // - Applies optional request overrides (dcql_query / presentation_definition) and signing options.
    // - Returns `{ qrCodeData, qrData, inputData }` on success, or a 4xx/5xx error message on failure.
    // Request params:
    // - path.client_id_scheme: pre-registered | redirect_uri | did
    // - path.request_mode: by_value | by_reference
    // - query.draft: draft version (optional, defaults to version-1.0)
    // Request body (optional):
    // - signed: true | false
    // - response_mode: direct_post | direct_post.jwt
    // - dcql_query: object (draft version-1.0)
    // - presentation_definition: object (non-version-1.0 drafts)
    // Response:
    // - 200 application/json:
    //   {
    //     qrCodeData: string (data URL for rendered QR image),
    //     qrData: string (raw openid4vp://authorize URL payload),
    //     inputData: object (final verifier request used to generate qrData)
    //   }
    // - 400 text/plain for invalid combinations/unsupported params/oversized QR payload.
    // - 500 text/plain for unexpected server errors.
    app.post('/verifier/:client_id_scheme/:request_mode', async (req, res) => {
        await generateQrCode(req, res);
    });
}

module.exports = { registerVerifierRoutes };

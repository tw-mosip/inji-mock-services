import crypto from "crypto";
import { iarSessions } from "./iar-store.js";
import { authCodeStore } from "./authz-store.js";
import { authServerBaseUrl, issuerBaseUrl, resolveRequestVersion } from "../issuer-profile.js";
import { verifierConfig } from "./verifier-config.js";

function randomSession() {
  return crypto.randomBytes(10).toString("hex");
}

function randomCode() {
  return crypto.randomBytes(16).toString("hex");
}

/**
 * Fetch VP request info from verifier QR API and build a VP request object
 * @returns {Promise<Object>} The VP request object
 */
async function fetchVPRequest() {
  const clientIdScheme = verifierConfig.clientIdScheme;
  const draftVersion = verifierConfig.specVersion;
  const responseMode = verifierConfig.responseMode;
  const requestMode = verifierConfig.requestMode;
  const signedRequest = verifierConfig.signedRequest;

  const requestBody = {
    signed: signedRequest,
    response_mode: responseMode,
  };

  if (draftVersion === "version-1.0") {
    requestBody.dcql_query = verifierConfig.dcqlQuery;
  } else {
    requestBody.presentation_definition = verifierConfig.presentationDefinition;
  }

  try {
    const requestUrl = new URL(
      `${verifierConfig.verifierBaseUrl}/verifier/${clientIdScheme}/${requestMode}`
    );
    requestUrl.searchParams.set("draft", draftVersion);

    console.log(
      `Fetching VP request info from: ${requestUrl.toString()}`
    );

    const response = await fetch(requestUrl.toString(), {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(requestBody),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(
        `Failed to fetch VP request info: ${response.status} ${response.statusText}${errorText ? ` - ${errorText}` : ""}`
      );
    }

    const payload = await response.json();
    const inputData = payload?.inputData;
    if (!inputData || typeof inputData !== "object") {
      throw new Error("Verifier response does not contain inputData");
    }

    console.log("Successfully fetched VP request info");
    console.debug("VP request:", JSON.stringify(inputData, null, 2));
  
    return inputData;
  } catch (error) {
    console.error("Error fetching VP request info:", error);
    throw error;
  }
}

export default async function interactiveAuthorizationHandler(req, res) {
  const version = resolveRequestVersion(req);
  const flow = req.params?.flow === "pdi" ? "pdi" : null;
  const issuer = issuerBaseUrl(version, Boolean(req.params?.version), flow);
  const authServer = authServerBaseUrl(version, Boolean(req.params?.version), flow);

  // --------------------------
  // CASE 1: PHASE 2 (wallet returns VP)
  // --------------------------
  if (req.body.auth_session) {
    const sessionId = req.body.auth_session;
    const session = iarSessions.get(sessionId);

    if (!session) {
      return res.status(400).json({ error: "invalid_session" });
    }

    const openid4vp_response = req.body;
    console.log("Received openid4vp_response:", openid4vp_response);
    if (!openid4vp_response) {
      return res.status(400).json({
        error: "invalid_request",
        error_description: "openid4vp_response missing",
      });
    }

    // MOCK validation: accept any VP
    // real-world: validate signature, proof, etc.

    // Create authorization code
    const code = randomCode();

    authCodeStore.set(code, {
      client_id: session.client_id,
      redirect_uri: session.redirect_uri,
      scope: "openid",
      created_at: Date.now(),
    });

    // Clean session
    iarSessions.delete(sessionId);

    return res.json({
      status: "authorization_code_issued",
      code: code,
      state: session.state || null,
      iss: authServer,
    });
  }

  // --------------------------
  // CASE 2: PHASE 1 (start IAR flow)
  // --------------------------

  const {
    client_id,
    redirect_uri,
    state,
    issuer_state,
    authorization_details,
  } = req.body;

  const sessionId = randomSession();

  iarSessions.set(sessionId, {
    client_id,
    redirect_uri,
    state,
    issuer_state,
    authorization_details,
    pd: verifierConfig.presentationDefinition,
    dcqlQuery: verifierConfig.dcqlQuery,
  });

  try {
    // Fetch the VP request object from the verifier service
    const requestObject = await fetchVPRequest();

    const interactionRequiredResponse = {
      status: "require_interaction",
      type: "openid4vp_presentation",
      auth_session: sessionId,
      credential_issuer: issuer,
      openid4vp_request: requestObject,
    };
    console.debug("Respondingw ith interaction requried response : ", JSON.stringify(interactionRequiredResponse, null, 2))
    // Respond with a presentation request
    return res.json(interactionRequiredResponse);
  } catch (error) {
    console.error("Error in interactive authorization handler:", error);
    return res.status(500).json({
      error: "server_error",
      error_description: "Failed to fetch VP request object",
    });
  }
}

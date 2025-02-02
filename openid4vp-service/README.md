# openid4vp-service

**Description**: This is a mock service which mocks openid4vp backend to generate a QR code with Verifiable Presentation request and receive response in response-uri end-point.

### Command to Start the Mock server

```
node app.js // execute this command in the openid4vp-service folder
```

### This exposes five end-points:

- Refer to app.js file for the below end-points.

### 1. /verifier/generate-auth-request-by-value-qr:

- This end-point can be used to generate the QR code with the Verifier's Authorization Request to
  fetch the Verifiable Credentials from the Wallet.
- Here configure the **response_uri** field of the **Authorization Request** with the actual
  end-point where we would like to receive the response. Here Localhost won't be accessible from the
  physical device, recommended using ngrok [https://ngrok.com/docs/getting-started/] to generate a
  corresponding mapping url for the Localhost.
- As part of the Authorization Request Verifier can send **presentation_definition_uri** instead of the full **presentation_definition** to reduce the amount of data embedded in the QR code and this uri returns the actual **presentation_definition** object when called and only one of **presentation_definition** & **presentation_definition_uri** should be present in the request.

**Ex:**

##### Send _presentation_definition_ in request:
```javascript
    const authorizationRequest =
    "https://client.example.org/universal-link?
    response_type=vp_token
    &response_mode=direct_post
    &client_id=https%3A%2F%2Fclient.example.org%2Fcb
    &client_id_scheme=redirect_uri
    &redirect_uri=https%3A%2F%2Fclient.example.org%2Fcb
    &presentation_definition=...
    &nonce=n-0S6_WzA2Mj
    &response_uri=ngrokUrl+"/verifier/vp-response"
    &client_metadata=%7B%22vp_formats%22:%7B%22jwt_vp_json%22:%
    7B%22alg%22:%5B%22EdDSA%22,%22ES256K%22%5D%7D,%22ldp
    _vp%22:%7B%22proof_type%22:%5B%22Ed25519Signature201
    8%22%5D%7D%7D%7D"
```

or

##### Send _presentation_definition_uri_ in request:
```javascript
    const authorizationRequest =
    "https://client.example.org/universal-link?
    response_type=vp_token
    &response_mode=direct_post
    &client_id=https%3A%2F%2Fclient.example.org%2Fcb
    &client_id_scheme=redirect_uri
    &redirect_uri=https%3A%2F%2Fclient.example.org%2Fcb
    &presentation_definition_uri=ngrokUrl+"/verifier/presentation_definition_uri"
    &nonce=n-0S6_WzA2Mj
    &response_uri=ngrokUrl+"/verifier/vp-response"
    &client_metadata=%7B%22vp_formats%22:%7B%22jwt_vp_json%22:%
    7B%22alg%22:%5B%22EdDSA%22,%22ES256K%22%5D%7D,%22ldp
    _vp%22:%7B%22proof_type%22:%5B%22Ed25519Signature201
    8%22%5D%7D%7D%7D"
```

### 2. /verifier/generate-auth-request-by-reference-qr:
- This end-point can be used to generate the QR code with `request uri` field which is used to get the Verifier's Authorization Request to fetch the Verifiable Credentials from the Wallet.
- Here configure the `request_uri` field with the actual end-point where we can fetch the Authorization Request. Here Localhost won't be accessible from the physical device, recommended using ngrok [https://ngrok.com/docs/getting-started/] to generate a corresponding mapping url for the Localhost. 
- The response of the `request_uri` will either be a jwt or base64 encoded json string which contains the Authorization Request 
##### Send _request_uri_ in the qr code:
```javascript
    const authorizationRequest =
    "https://client.example.org/universal-link?
    &client_id=https%3A%2F%2Fclient.example.org%2Fcb
    &client_id_scheme=redirect_uri
    &request_uri_method=get
    &request_uri=ngrokUrl+"/verifier/get-auth-request-obj"

```

### 3. /verifier/presentation_definition_uri:
- This end-point can be passed as part of the Verifier's Authorization Request QR code which gives the actual presentation_definition object when called.
- Please refer to the above example to understand how to send presentation_definition_uri as part of the Authorization Request.

### 4. /verifier/vp-response:
- This is the response_uri end-point which is used to listen to the Verifiable Presentation response
  shared by the wallet and return the response back to the wallet to notify whether this server has
  received the response or not.
- It just receives the Verifiable Presentation response in the request body and returns
  the response but doesn't perform any validations on the received data.

### 5. /verifier/get-auth-request-obj:
- This is the request_uri endpoint which is used to generate and send the Authorisation Request object either as a JWT or base64 encoded string.



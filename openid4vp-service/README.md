# openid4vp-service

**Description**: 

This is a mock service which mocks openid4vp backend to generate a QR code with Verifiable Presentation request and receive response in response-uri end-point.

#### specification followed

openID4VP [Specification-21](https://openid.net/specs/openid-4-verifiable-presentations-1_0-21.html) and  [Specification-23](https://openid.net/specs/openid-4-verifiable-presentations-1_0-23.html).

### Start the service

#### Pre-requisites before starting the service
1. In case of testing out mso_mdoc VP share, ensure the mso_mdoc presentation definition's docType and claim is updated in presentationDefinitionMock.json file

#### Steps to start service
1. Install the dependencies
   - Change directory to openid4vp-service
```bash
  cd openid4vp-service
  npm install
```
2. Modify the configuration
   - update the `baseUrl` constant in `app.js` file with the actual base url (exposed localtunnel url. Reference : [ https://theboroer.github.io/localtunnel-www/ ]) where the service is running.
   - modify `presentationDefinitionMock.json` file with the presentation definition object as per requirement.
3. Start the service
   - Start the service by running the below command
   - Note: Make sure the current working directory is openid4vp-service

```bash
  node app.js 
```

To simplify the process, script is also exposed 

#### start up script

Post performing the pre-requisites, you can run the below command to start the service.

```shell
npm install # install the dependencies
npm start # asks base url (localtunnel url or any remote url) and starts the service
```

# Supported features

| Feature                                                   | Supported values                                                                                                                                                                                                                                                                                                                                                   |
|-----------------------------------------------------------|--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| Device flow                                               | cross device flow (QR code generated for the authorization request), Same device flow (Generated QR code with authorization request is clickable)                                                                                                                                                                                                                  |
| Client id scheme                                          | `pre-registered`, `redirect_uri`, `did`                                                                                                                                                                                                                                                                                                                            |
| Signed authorization request algorithms                   | Ed25519                                                                                                                                                                                                                                                                                                                                                            |
| Creating authorization request                            | By value, By reference ( via `request_uri` method) <br> _[Note: Authorization request by value is not supported for the did client ID scheme, as it requires a signed request. Instead, a Request URI should be used to fetch the signed authorization request ([reference](https://openid.net/specs/openid-4-verifiable-presentations-1_0-23.html#section-3.2))]_ |
| Creating presentation definition in authorization request | By value, By reference (via `presentation_definition_uri`)                                                                                                                                                                                                                                                                                                         |
| Authorization Response mode                               | `direct_post`, `direct_post.jwt` (with encrypted & unsigned responses)                                                                                                                                                                                                                                                                                             |
| Authorization Response type                               | `vp_token`                                                                                                                                                                                                                                                                                                                                                         |
| Supported Credential formats                              | `ldp_vc`, `mso_mdoc`                                                                                                                                                                                                                                                                                                                                               |


### This exposes five end-points:

- Refer to app.js file for the below end-points.

### 1. Create QR code for Verifier's Authorization Request By Value

```
/verifier/generate-auth-request-by-value-<client_id_scheme>-qr
```

- This end-point can be used to generate the QR code with the Verifier's Authorization Request to
  fetch the Verifiable Credentials from the Wallet.
- The client_is_scheme can be one of the following:

| client_id_scheme | api                                                          |
|------------------|--------------------------------------------------------------|
| redirect_uri     | `/verifier/generate-auth-request-by-value-redirect-qr`       |
| pre-registered   | `/verifier/generate-auth-request-by-value-pre-registered-qr` |

- Here configure the **response_uri** field of the **Authorization Request** with the actual
  end-point where we would like to receive the response. Here Localhost won't be accessible from the
  physical device, recommended using local tunnel [https://theboroer.github.io/localtunnel-www/ ] generate a
  corresponding mapping url for the Localhost.
- As part of the Authorization Request Verifier can send **presentation_definition_uri** instead of the full **presentation_definition** to reduce the amount of data embedded in the QR code and this uri returns the actual **presentation_definition** object when called and only one of **presentation_definition** & **presentation_definition_uri** should be present in the request.

**Ex:**

##### Send _presentation_definition_ in request:
```javascript
    const authorizationRequest =
    "https://client.example.org/universal-link?
    response_type=vp_token
    &response_mode=direct_post
    &client_id=redirect_uri:https%3A%2F%2Fclient.example.org%2Fcb
    &redirect_uri=https%3A%2F%2Fclient.example.org%2Fcb
    &presentation_definition=...
    &nonce=n-0S6_WzA2Mj
    &response_uri=baseUrl+"/verifier/vp-response"
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
    &client_id=redirect_uri:https%3A%2F%2Fclient.example.org%2Fcb
    &redirect_uri=https%3A%2F%2Fclient.example.org%2Fcb
    &presentation_definition_uri=baseUrl+"/verifier/presentation_definition_uri"
    &nonce=n-0S6_WzA2Mj
    &response_uri=baseUrl+"/verifier/vp-response"
    &client_metadata=%7B%22vp_formats%22:%7B%22jwt_vp_json%22:%
    7B%22alg%22:%5B%22EdDSA%22,%22ES256K%22%5D%7D,%22ldp
    _vp%22:%7B%22proof_type%22:%5B%22Ed25519Signature201
    8%22%5D%7D%7D%7D"
```

### 2. Create QR code for Verifier's Authorization Request By Reference

```
/verifier/generate-auth-request-by-reference-qr
```
- This end-point can be used to generate the QR code with `request uri` field which is used to get the Verifier's Authorization Request to fetch the Verifiable Credentials from the Wallet.
- Here configure the `request_uri` field with the actual end-point where we can fetch the Authorization Request. Here Localhost won't be accessible from the physical device, recommended using localtunnel [https://theboroer.github.io/localtunnel-www/ ] to generate a corresponding mapping url for the Localhost. 
- The response of the `request_uri` will either be a jwt or base64 encoded json string which contains the Authorization Request 
##### Send _request_uri_ in the qr code:
```javascript
    const authorizationRequest =
    "https://client.example.org/universal-link?
    &client_id=redirect_uri:https%3A%2F%2Fclient.example.org%2Fcb
    &request_uri_method=get
    &request_uri=baseUrl+"/verifier/get-auth-request-obj"

```

#### 3. Get Authorization Request Object

```
/verifier/get-auth-request-obj:
```
- This is the request_uri endpoint which is used to generate and send the Authorisation Request object either as a JWT or base64 encoded string.


### 4. Get Presentation Definition Object

```
/verifier/presentation_definition_uri
```
- This end-point can be passed as part of the Verifier's Authorization Request QR code which gives the actual presentation_definition object when called.
- Please refer to the above example to understand how to send presentation_definition_uri as part of the Authorization Request.

### 5. Submission of Authorization Response

```
/verifier/vp-response:
```

- This is the response_uri end-point which is used to listen to the Verifiable Presentation response
  shared by the wallet and return the response back to the wallet to notify whether this server has
  received the response or not.
- It just receives the Verifiable Presentation response in the request body and returns
  the response but doesn't perform any validations on the received data.


## Client id schemes supported

1. `redirect_uri` scheme (example: client_id: `https://client.example.org/cb`)
2. `did` scheme (example: client_id: `did:example:123`)
3. `pre-registered` scheme (example: client_id: `mock-example client`)

## Port & Tunnel Configuration

**Mock Backend Service**
- Runs on http://localhost:3000 and is exposed via LocalTunnel at a public URL (e.g., https://your-subdomain.loca.lt).
- Expose port number `3000` using localtunnel
  - Install localtunnel globally if you haven't already:
    ```
    npm install -g localtunnel
    ```
      - Start localtunnel to expose your backend service:
    ```
    lt --port 3000 --subdomain <name> # Replace <name> with any unique subdomain
    ```
- Open the exposed localtunnel url in browser and access the mock services using tunnel password. Steps to get tunnel password are provided in the mock service page itself.
    
**Mock Frontend UI**
- Runs on http://localhost:3001 and is exposed via ngrok at a public URL (e.g., https://your-ui.ngrok.io).
- Steps to run the Mock Frontend UI are provided in the `ovp-client/README.md` file.

Reference: https://openid.net/specs/openid-4-verifiable-presentations-1_0-23.html#name-client-identifier-scheme-an

## Version Supported

- OpenId4VP library version: [0.3.0](https://github.com/mosip/inji-openid4vp/tree/release-0.3.x)
- Inji Wallet version: [0.17.0](https://github.com/mosip/inji-wallet/tree/release-0.17.x)

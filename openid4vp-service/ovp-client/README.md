# Client App for OVP Mock Server

This React client application is built to interact with the OpenID4VP mock verifier services. It provides a user-friendly interface to:

- Select and generate different types of OpenID4VP Authorization Requests (by-value, by-reference, pre-registered).
- Switch between the supported OpenID4VP request versions: `draft-23` and `version-1.0`.
- Display the corresponding QR codes for mobile wallet scanning.
- Listen for Verifiable Presentation (VP) responses sent by wallets after scanning.
- Visually display parsed VP tokens, presentation submissions, and other payloads.
- It serves as a frontend demo for testing OpenID4VP flows using mock services.

## Features

- Editable configurations for testing different verifier flows, including request mode, supported spec version selection (`draft-23` and `version-1.0`), response mode, and request signing options.
- QR code display for generated presentation requests, with actions to download the QR image and open the same request in InjiWeb.
- QR code information panels for viewing the generated request data, QR payload, and actual authorization request object for `request_uri` flows.
- Scan result display that polls for wallet responses and shows either the received VP response or any returned error details.
- Decoded view for encoded data so JWT-based request content can be inspected in decoded as well as encoded form.
- Editable presentation request details that allow updating the DCQL query or presentation definition before submitting the presentation request.

## Steps to run the client app
- Run the mock services by running `npm start` in the `openid4vp-service` directory. It will be running in the port `3000`.
- Expose the backend service using localtunnel url by running the command `lt --port 3000 --subdomain <your-subdomain>` in another terminal. Replace `<your-subdomain>` with any unique name.
- Update the baseUrl in `openid4vp-service/constants.js` and BACKEND_URL in `ovp-client/src/constants/mockui-constants.js` with the localtunnel url. Restart the backend service.
- **Configure INJIWEB_URL**: Update the `INJIWEB_URL` in `ovp-client/src/constants/mockui-constants.js` based on the environment you want to integrate with:
  - For development environment: `https://injiweb.dev-int-inji.mosip.net/authorize`
  - For local InjiWeb instance: `http://localhost:3004/authorize`
  - For other environments: Update with the appropriate InjiWeb authorization URL
  - This URL is used when clicking the "Open InjiWeb" button in the client app to test the integration with InjiWeb wallet.
- In other terminal, go inside the `ovp-client` directory and run `npm install` to install the required dependencies.
- Then run ``npm start`` to start the client app. It will be running in the port `3001`.
- Open your browser and navigate to `http://localhost:3001` to access the client app.
- You can now interact with the OpenID4VP mock services through the client app.
- User can select the Auth Request Type to generate respective QR Codes for the wallet to scan.
- User can download QR code by clicking on the download icon below to the QR code.
- Once the wallet scans the QR code, it will send the Verifiable Presentation (VP) response back to the client app.
- Error response also shown in Scan Result section.
- Running in mobile browser:
  - Run localtunnel backend url in mobile browser and provide tunnel password if it prompts. This step is mandatory to make sure the localtunnel baceknd url is accessible from mobile.
  - Expose client app through ngrok using command `ngrok http 3001` if you want to access it from a mobile device. Refer [ https://ngrok.com/docs/getting-started/ ] for ngrok setup
  - Hit the exposed ngrok url in the browser.


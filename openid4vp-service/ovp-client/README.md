# Client App for OVP Mock Server

This React client application is built to interact with the OpenID4VP mock verifier services. It provides a user-friendly interface to:

- Select and generate different types of OpenID4VP Authorization Requests (by-value, by-reference, pre-registered).
- Display the corresponding QR codes for mobile wallet scanning.
- Listen for Verifiable Presentation (VP) responses sent by wallets after scanning.
- Visually display parsed VP tokens, presentation submissions, and other payloads.
- It serves as a frontend demo for testing OpenID4VP flows using mock services.

## Steps to run the client app

- Run the mock services by running `npm start` in the `openid4vp-service` directory. It will be running in the port `3000`.
- In other terminal, go inside the `ovp-client` directory and run `npm install` to install the required dependencies.
- Then run ``PORT=3001 npm start`` to start the client app. It will be running in the port `3001`.
- Open your browser and navigate to `http://localhost:3001` to access the client app.
- You can now interact with the OpenID4VP mock services through the client app.
- User can select the Auth Request Type to generate respective QR Codes for the wallet to scan.
- User can download QR code by clicking on the download icon below to the QR code.
- Once the wallet scans the QR code, it will send the Verifiable Presentation (VP) response back to the client app.
- Error response also shown in Scan Result section.

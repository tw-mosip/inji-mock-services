const express = require('express');
const path = require('path');
const QRCode = require('qrcode');
const presentationDefinition = require('./presentationDefinitionMock.json');
const bodyParser = require('body-parser');
const {createJWT} = require("./jwt");
const app = express();
const {requestUri,didDocumentUrl} = require("./constants");
const {redirectAuthorizationRequest, preRegisteredAuthorizationRequest, didAuthorizationRequest,
    authorizationRequestParams
} = require("./inputData");
const PORT = 3000;



app.use(bodyParser.urlencoded({ limit: '20mb', extended: true }));
app.set('view engine', 'ejs');

app.set('views', path.join(__dirname, 'views'));

app.use(express.static(path.join(__dirname, 'public')));

function createUrlWithParams( params) {
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

    res.render('index', { title: 'Home', qrCodeData });
  } catch (error) {
    console.error('Error generating QR code:', error);
    res.status(500).send('Internal Server Error');
  }
});

app.get('/verifier/generate-auth-request-by-value-pre-registered-qr', async (req, res) => {
  try {
     const qrData = createUrlWithParams(preRegisteredAuthorizationRequest);
     const qrCodeData = await QRCode.toDataURL(qrData);

     res.render('index', { title: 'Home', qrCodeData });
  } catch (error) {
    console.error('Error generating QR code:', error);
    res.status(500).send('Internal Server Error');
  }
});

app.get('/verifier/generate-auth-request-by-reference-qr', async (req, res) => {
    try {
        const qrData = createUrlWithParams(authorizationRequestParams);
        const qrCodeData = await QRCode.toDataURL(qrData);

        res.render('index', {title: 'Home', qrCodeData});
    } catch (error) {
        console.error('Error generating QR code:', error);
        res.status(500).send('Internal Server Error');
    }
});

app.get('/verifier/get-auth-request-obj', async (req, res) => {
    try {
        const jwt = await createJWT(didAuthorizationRequest)
        res.send(jwt)
        //res.send(btoa(JSON.stringify(didAuthorizationRequest)))

    } catch (error) {
        console.error('Error generating JWT :', error);
        res.status(500).send('Internal Server Error');
    }
});

app.get('/verifier/presentation_definition_uri', async (req, res) => {
  res.send(presentationDefinition);
});

app.post('/verifier/vp-response', (req, res) => {
  // console.log('vp_token:', req.body.vp_token);
  // console.log('presentation_submission:', req.body.presentation_submission);

  /*Change this response for testing other flows*/
  res.status(200).json({
    message: `Verifiable presentation is received successfully.`,
  });
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
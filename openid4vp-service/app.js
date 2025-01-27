const express = require('express');
const path = require('path');
const QRCode = require('qrcode');
const crypto = require('crypto');
const presentationDefinition = require('./presentationDefinitionMock.json');
const clientMetadata = require('./clientMetadataMock.json');
const bodyParser = require('body-parser');
const {createJWT} = require("./jwt");
const {baseUrl, requestUri, responseUri} = require("./constants");
const app = express();
const PORT = 3000;

var nonce, state;

app.use(bodyParser.urlencoded({ limit: '20mb', extended: true }));
app.set('view engine', 'ejs');

app.set('views', path.join(__dirname, 'views'));

app.use(express.static(path.join(__dirname, 'public')));

app.get('/verifier/generate-auth-request-by-value-qr', async (req, res) => {
  try {
    const presentation_definition = JSON.stringify(presentationDefinition);
    const client_metadata = JSON.stringify(clientMetadata);
    nonce = crypto.randomBytes(16).toString('base64');
    state = crypto.randomBytes(16).toString('base64');

    const authorizationRequest = `client_id=https://injiverify.dev1.mosip.net&presentation_definition=${presentation_definition}&response_type=vp_token&response_mode=direct_post&nonce=${nonce}&state=${state}&response_uri=${responseUri}&client_metadata=${client_metadata}`;
    const qrCodeData = await QRCode.toDataURL('openid4vp://authorize?' + btoa(authorizationRequest));

    res.render('index', { title: 'Home', qrCodeData });
  } catch (error) {
    console.error('Error generating QR code:', error);
    res.status(500).send('Internal Server Error');
  }
});


app.get('/verifier/generate-auth-request-by-reference-qr', async (req, res) => {
    try {
        const authorizationRequest = `client_id=did:web:adityankannan-tw.github.io:openid4vp:files&client_id_scheme=did&request_uri=${requestUri}&request_uri_method=post HTTP/1.1`;
        const qrCodeData = await QRCode.toDataURL('openid4vp://authorize?' + btoa(authorizationRequest));
        res.render('index', {title: 'Home', qrCodeData});
    } catch (error) {
        console.error('Error generating QR code:', error);
        res.status(500).send('Internal Server Error');
    }
});

app.get('/verifier/get-auth-request-obj', async (req, res) => {
    try {
        const jwt = await createJWT()
        res.send(jwt)
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

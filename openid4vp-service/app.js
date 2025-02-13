const express = require('express');
const path = require('path');
const QRCode = require('qrcode');
const presentationDefinition = require('./presentationDefinitionMock.json');
const clientMetadata = require('./clientMetadataMock.json');
const bodyParser = require('body-parser');
const {createJWT, jwtPayload} = require("./jwt");
const app = express();
const {state, nonce,requestUri, responseUri, didDocumentUrl, publicKeyId} = require("./constants");
const PORT = 3000;



app.use(bodyParser.urlencoded({ limit: '20mb', extended: true }));
app.set('view engine', 'ejs');

app.set('views', path.join(__dirname, 'views'));

app.use(express.static(path.join(__dirname, 'public')));

app.get('/verifier/generate-auth-request-by-value-qr', async (req, res) => {
  try {
    const presentation_definition = JSON.stringify(presentationDefinition);
    const client_metadata = JSON.stringify(clientMetadata);

    const authorizationRequest = `client_id=https://injiverify.dev1.mosip.net&presentation_definition=${presentation_definition}&response_type=vp_token&response_mode=direct_post&nonce=${nonce}&state=${state}&response_uri=${responseUri}&client_metadata=${client_metadata}&client_id_scheme=pre-registered`;
    const qrCodeData = await QRCode.toDataURL('openid4vp://authorize?' + btoa(authorizationRequest));

    res.render('index', { title: 'Home', qrCodeData });
  } catch (error) {
    console.error('Error generating QR code:', error);
    res.status(500).send('Internal Server Error');
  }
});


app.get('/verifier/generate-auth-request-by-reference-qr', async (req, res) => {
    try {
        const authorizationRequest = `client_id=${didDocumentUrl}&client_id_scheme=did&request_uri=${requestUri}&request_uri_method=post`;
        //const authorizationRequest = `client_id=${didDocumentUrl}&client_id_scheme=did&request_uri=${requestUri}&request_uri_method=get`;
        const qrCodeData = await QRCode.toDataURL('openid4vp://authorize?' + btoa(authorizationRequest));
        res.render('index', {title: 'Home', qrCodeData});
    } catch (error) {
        console.error('Error generating QR code:', error);
        res.status(500).send('Internal Server Error');
    }
});
//openid4vp://authorize?client_id=https://injiverify.dev1.mosip.net&presentation_definition=

app.get('/verifier/get-auth-request-obj', async (req, res) => {
    try {
        const jwt = await createJWT()
        res.send(jwt)
        //res.send(btoa(JSON.stringify(jwtPayload)))
    } catch (error) {
        console.error('Error generating JWT :', error);
        res.status(500).send('Internal Server Error');
    }
});

app.post('/verifier/get-auth-request-obj', async (req, res) => {
    try {
        const jwt = await createJWT()
        res.send(jwt)
        //res.send(btoa(JSON.stringify(jwtPayload)))
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

import { SignJWT } from 'jose';
import { randomBytes, createHash } from 'node:crypto';

function base64url(buffer) {
  return buffer.toString('base64url');
}

function sha256(data) {
  return createHash('sha256').update(data).digest();
}

export async function createSdJwt(payload, privateKey, issuer, holderDid) {
  const disclosures = [];
  const sdHashes = [];

  const claimsToDisclose = Object.keys(payload).filter(k => k !== 'iss' && k !== 'sub' && k !== 'iat' && k !== 'exp' && k !== 'nbf' && k !== 'jti' && k !== 'vct');

  const newPayload = { ...payload };
  
  for (const claim of claimsToDisclose) {
    const salt = base64url(randomBytes(16));
    const disclosureArray = [salt, claim, payload[claim]];
    const disclosureJson = JSON.stringify(disclosureArray);
    const disclosureB64 = Buffer.from(disclosureJson).toString('base64url');
    disclosures.push(disclosureB64);
    
    const hash = base64url(sha256(disclosureB64));
    sdHashes.push(hash);
    delete newPayload[claim];
  }

  newPayload._sd = sdHashes.sort();
  newPayload._sd_alg = 'sha-256';
  newPayload.keyName = "Simon"
  newPayload.residence = "Bangalore";

  const jwt = await new SignJWT(newPayload)
    .setProtectedHeader({ alg: 'ES256', typ: 'vc+sd-jwt', kid: issuer })
    .setIssuedAt()
    .setIssuer(issuer)
    .setSubject(holderDid)
    .setExpirationTime('1y')
    .sign(privateKey);

  return jwt + '~' + disclosures.join('~') + '~';
}

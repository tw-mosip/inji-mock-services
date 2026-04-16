import * as cbor from 'cbor-x';
import * as cose from 'cose-js';
import { createHash, randomBytes } from 'node:crypto';

function sha256(data) {
  return createHash('sha256').update(data).digest();
}

export async function createMdoc(payload, privateKeyJwk, publicKeyJwk, docType, namespaces) {
  const issuerSigned = {
    nameSpaces: {},
    issuerAuth: null
  };

  const valueDigests = {};

  for (const ns of Object.keys(namespaces)) {
    issuerSigned.nameSpaces[ns] = [];
    valueDigests[ns] = {};
    
    const nsClaims = namespaces[ns];
    let digestId = 0;
    
    for (const claim of Object.keys(nsClaims)) {
      const salt = randomBytes(16);
      
      const item = {
        digestID: digestId,
        random: salt,
        elementIdentifier: claim,
        elementValue: nsClaims[claim]
      };
      
      const encodedItem = cbor.encode(item);
      const taggedItem = new cbor.Tag(encodedItem, 24);
      issuerSigned.nameSpaces[ns].push(taggedItem);
      
      const digest = sha256(cbor.encode(taggedItem));
      valueDigests[ns][digestId] = digest;
      
      digestId++;
    }
  }

  const mso = {
    version: "1.0",
    digestAlgorithm: "SHA-256",
    valueDigests: valueDigests,
    deviceKeyInfo: {
      deviceKey: {
          kty: 'EC',
          crv: 'P-256',
          x: publicKeyJwk.x,
          y: publicKeyJwk.y
      }
    },
    docType: docType,
    validityInfo: {
      signed: new Date(),
      validFrom: new Date(),
      validUntil: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000)
    }
  };

  const msoCbor = cbor.encode(new cbor.Tag(mso, 24));
  
  // Sign MSO with COSE
  const signer = {
    key: {
      d: Buffer.from(privateKeyJwk.d, 'base64url'),
      x: Buffer.from(privateKeyJwk.x, 'base64url'),
      y: Buffer.from(privateKeyJwk.y, 'base64url')
    }
  };
  
  // For COSE_Sign1:
  // headers.p contains protected headers
  // headers.u contains unprotected headers
  // signers is a single signer object
  const headers = {
    p: { alg: 'ES256' },
    u: { kid: privateKeyJwk.kid }
  };
  
  try {
    // In cose-js 0.9.0, exports.create(headers, payload, signers, options)
    // If signers is NOT an array, it creates a COSE_Sign1.
    const signature = await cose.sign.create(headers, msoCbor, signer);
    issuerSigned.issuerAuth = signature;
  } catch (err) {
    console.error("COSE signing failed:", err);
    throw err;
  }

  const mdoc = {
    version: "1.0",
    documents: [
      {
        docType: docType,
        issuerSigned: issuerSigned,
        deviceSigned: {
          nameSpaces: {},
          deviceAuth: {
            deviceSignature: null 
          }
        }
      }
    ],
    status: 0
  };

  return cbor.encode(mdoc);
}

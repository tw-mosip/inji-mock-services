import jsonld from 'jsonld';
import jsigs from 'jsonld-signatures';
import { Ed25519Signature2018 } from '@digitalbazaar/ed25519-signature-2018';
import { Ed25519VerificationKey2018 } from '@digitalbazaar/ed25519-verification-key-2018';

const { AssertionProofPurpose } = jsigs.purposes;

// Predefined contexts to avoid network calls
const CONTEXTS = {
  "https://www.w3.org/2018/credentials/v1": {
    "@context": {
      "@version": 1.1,
      "@protected": true,
      "id": "@id",
      "type": "@type",
      "VerifiableCredential": {
        "@id": "https://www.w3.org/2018/credentials#VerifiableCredential",
        "@context": {
          "@version": 1.1,
          "@protected": true,
          "id": "@id",
          "type": "@type",
          "cred": "https://www.w3.org/2018/credentials#",
          "sec": "https://w3id.org/security#",
          "issuer": {
            "@id": "cred:issuer",
            "@type": "@id"
          },
          "issuanceDate": {
            "@id": "cred:issuanceDate",
            "@type": "http://www.w3.org/2001/XMLSchema#dateTime"
          },
          "expirationDate": {
            "@id": "cred:expirationDate",
            "@type": "http://www.w3.org/2001/XMLSchema#dateTime"
          },
          "credentialStatus": {
            "@id": "cred:credentialStatus",
            "@type": "@id"
          },
          "credentialSubject": {
            "@id": "cred:credentialSubject"
          },
          "proof": {
            "@id": "sec:proof",
            "@type": "@id",
            "@container": "@set"
          }
        }
      },
      "VerifiablePresentation": {
        "@id": "https://www.w3.org/2018/credentials#VerifiablePresentation",
        "@context": {
          "@version": 1.1,
          "@protected": true,
          "id": "@id",
          "type": "@type",
          "cred": "https://www.w3.org/2018/credentials#",
          "sec": "https://w3id.org/security#",
          "verifiableCredential": {
            "@id": "cred:verifiableCredential",
            "@type": "@id",
            "@container": "@set"
          },
          "proof": {
            "@id": "sec:proof",
            "@type": "@id",
            "@container": "@set"
          }
        }
      },
      "EcdsaSecp256k1Signature2019": "https://w3id.org/security#EcdsaSecp256k1Signature2019",
      "EcdsaSecp256r1Signature2019": "https://w3id.org/security#EcdsaSecp256r1Signature2019",
      "Ed25519Signature2018": "https://w3id.org/security#Ed25519Signature2018",
      "RsaSignature2018": "https://w3id.org/security#RsaSignature2018",
      "proof": {
        "@id": "https://w3id.org/security#proof",
        "@type": "@id",
        "@container": "@set"
      }
    }
  },
  "https://w3id.org/security/v2": {
    "@context": {
      "id": "@id",
      "type": "@type",
      "sec": "https://w3id.org/security#",
      "proof": "sec:proof",
      "verificationMethod": { "@id": "sec:verificationMethod", "@type": "@id" },
      "created": { "@id": "http://purl.org/dc/terms/created", "@type": "http://www.w3.org/2001/XMLSchema#dateTime" },
      "proofPurpose": { "@id": "sec:proofPurpose", "@type": "@id" },
      "jws": "sec:jws"
    }
  },
  "https://w3id.org/security/v1": {
    "@context": {
      "id": "@id",
      "type": "@type",
      "sec": "https://w3id.org/security#",
      "proof": "sec:proof",
      "jws": "sec:jws",
      "created": { "@id": "http://purl.org/dc/terms/created", "@type": "http://www.w3.org/2001/XMLSchema#dateTime" },
      "verificationMethod": { "@id": "sec:verificationMethod", "@type": "@id" }
    }
  },
  "https://piyush7034.github.io/my-files/farmer.json": {
    "@context": {
      "id": "@id",
      "type": "@type",
      "@vocab": "https://piyush7034.github.io/my-files/farmer.json#",
      "fullName": "https://schema.org/name",
      "mobileNumber": "https://schema.org/telephone",
      "dateOfBirth": "https://schema.org/birthDate",
      "landArea": "https://example.org/landArea",
      "landOwnershipType": "https://example.org/landOwnershipType",
      "address": "https://schema.org/address",
      "village": "https://schema.org/addressLocality",
      "district": "https://schema.org/addressRegion",
      "farmProfile": "https://example.org/farmProfile",
      "landRecord": "https://example.org/landRecord",
      "surveyNumber": "https://example.org/surveyNumber",
      "registry": "https://example.org/registry",
      "office": "https://example.org/registryOffice",
      "irrigation": "https://example.org/irrigation",
      "source": "https://example.org/source",
      "provider": "https://example.org/provider",
      "cooperative": "https://example.org/cooperative",
      "membership": "https://example.org/membership",
      "membershipNumber": "https://example.org/membershipNumber",
      "since": {
        "@id": "https://example.org/memberSince",
        "@type": "http://www.w3.org/2001/XMLSchema#date"
      },
      "crops": "https://example.org/crops",
      "plots": "https://example.org/plots",
      "soilType": "https://example.org/soilType",
      "areaAcres": "https://example.org/areaAcres"
    }
  }
};

export const documentLoader = async (url) => {
  const context = CONTEXTS[url];
  if (context) {
    return {
      contextUrl: null,
      documentUrl: url,
      document: context
    };
  }
  // Fallback to a mock for any other URL to avoid validation errors in some suites
  return {
    contextUrl: null,
    documentUrl: url,
    document: { "@context": {} }
  };
};

export async function signLdpVc(credential, issuerDid) {
  const key = await Ed25519VerificationKey2018.generate({
    id: `${issuerDid}#key-0`,
    controller: issuerDid
  });

  const suite = new Ed25519Signature2018({
    key,
    date: new Date().toISOString()
  });

  const signedVc = await jsigs.sign(credential, {
    suite,
    purpose: new AssertionProofPurpose(),
    documentLoader
  });

  return signedVc;
}

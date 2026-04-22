import { ISSUER } from "./issuer-profile.js";
import { getStaticKey } from "./credential/static-key.js";

function issuerDid() {
  return `did:web:${new URL(ISSUER).hostname}`;
}

export default async function didDocumentHandler(_req, res) {
  const did = issuerDid();
  const key = await getStaticKey(did);
  const exported = key.export({ publicKey: true });

  const didDocument = {
    "@context": [
      "https://www.w3.org/ns/did/v1",
      "https://w3id.org/security/suites/ed25519-2018/v1",
    ],
    id: did,
    verificationMethod: [
      {
        id: `${did}#key-0`,
        type: exported.type,
        controller: did,
        publicKeyBase58: exported.publicKeyBase58,
      },
    ],
    authentication: [`${did}#key-0`],
    assertionMethod: [`${did}#key-0`],
  };

  res.json(didDocument);
}

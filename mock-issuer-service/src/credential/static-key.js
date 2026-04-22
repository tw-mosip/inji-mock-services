import { Ed25519VerificationKey2018 } from '@digitalbazaar/ed25519-verification-key-2018';

let _cachedKey = null;

export async function getStaticKey(issuerDid) {
  if (_cachedKey && _cachedKey.controller === issuerDid) {
    return _cachedKey;
  }

  _cachedKey = await Ed25519VerificationKey2018.generate({
    id: `${issuerDid}#key-0`,
    controller: issuerDid,
  });

  return _cachedKey;
}

export async function getPublicKeyJwk(issuerDid) {
  const key = await getStaticKey(issuerDid);
  const exported = key.export({ publicKey: true });
  return {
    id: exported.id,
    type: exported.type,
    controller: exported.controller,
    publicKeyBase58: exported.publicKeyBase58,
  };
}

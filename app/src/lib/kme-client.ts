// Simple KME client (no mTLS shown; add fetch options or Bun client certs if you use mTLS)
export async function fetchEncKeys(kmeUrl: string, slaveSAE: string, opts: {
  number?: number,
  sizeBits?: number,
  lifetime?: number,
  additional_slave_SAE_IDs?: string[],
  key_IDs?: string[],
}) {
  const body: any = {};
  if (opts.number) body.number = opts.number;
  if (opts.sizeBits) body.size = opts.sizeBits;
  if (opts.lifetime) body.lifetime = opts.lifetime;
  if (opts.additional_slave_SAE_IDs) body.additional_slave_SAE_IDs = opts.additional_slave_SAE_IDs;
  if (opts.key_IDs) body.key_IDs = opts.key_IDs;

  const res = await fetch(`${kmeUrl}/api/v1/keys/${encodeURIComponent(slaveSAE)}/enc_keys`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
  if (!res.ok) throw new Error(`KME enc_keys failed: ${res.status}`);
  return res.json(); // { keys: [{ key_ID, key }] }
}

export async function fetchDecKeys(kmeUrl: string, masterSAE: string, keyIDs: string[]) {
  const res = await fetch(`${kmeUrl}/api/v1/keys/${encodeURIComponent(masterSAE)}/dec_keys`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ key_IDs: keyIDs }),
  });
  if (!res.ok) throw new Error(`KME dec_keys failed: ${res.status}`);
  return res.json(); // { keys: [{ key_ID, key }] }
}

export async function consumeKey(kmeUrl: string, slaveSAE: string, keyID: string) {
  const res = await fetch(`${kmeUrl}/api/v1/keys/${encodeURIComponent(slaveSAE)}/consume_key`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ key_ID: keyID }),
  });
  if (!res.ok) throw new Error(`KME consume_key failed: ${res.status}`);
  return res.json();
}

// Utility: HKDF-SHA256 derive (Node/Bun crypto)
import { createHmac as _createHmac } from 'crypto';
export function hkdfSha256(salt: Buffer, ikm: Buffer, info: Buffer, len: number) {
  // RFC5869 style: PRK = HMAC(salt, IKM); OKM = expand(PRK, info)
  const prk = _createHmac('sha256', salt).update(ikm).digest();
  let t = Buffer.alloc(0);
  let okm = Buffer.alloc(0);
  let i = 0;
  while (okm.length < len) {
    i++;
    const h = _createHmac('sha256', prk);
    h.update(Buffer.concat([t, info, Buffer.from([i])]));
    t = h.digest();
    okm = Buffer.concat([okm, t]);
    if (i > 255) throw new Error('HKDF expand too many iterations');
  }
  // Use .subarray instead of deprecated .slice
  return okm.subarray(0, len);
}

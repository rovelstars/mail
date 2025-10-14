import { fetchEncKeys, fetchDecKeys, consumeKey } from './kme-client';
import { Buffer } from 'buffer';

// Encrypt: fetch KME key with size >= plaintext bytes * 8
export async function otpEncrypt(kmeUrl: string, slaveSAE: string, plaintext: Buffer) {
  const numBits = plaintext.length * 8;
  const resp = await fetchEncKeys(kmeUrl, slaveSAE, { number: 1, sizeBits: numBits });
  const k64 = resp.keys[0].key;
  const keyBytes = Buffer.from(k64, 'base64');
  if (keyBytes.length < plaintext.length) throw new Error('Insufficient key material for OTP');
  const ct = Buffer.alloc(plaintext.length);
  for (let i = 0; i < plaintext.length; i++) ct[i] = plaintext[i] ^ keyBytes[i];
  // Optionally mark as consumed/deleted now:
  // await consumeKey(kmeUrl, slaveSAE, resp.keys[0].key_ID);
  return { key_ID: resp.keys[0].key_ID, ciphertext: ct.toString('base64') };
}

// Decrypt: fetch same key via dec_keys
export async function otpDecrypt(kmeUrl: string, masterSAE: string, keyID: string, ctB64: string) {
  const resp = await fetchDecKeys(kmeUrl, masterSAE, [keyID]);
  const k64 = resp.keys[0].key;
  const keyBytes = Buffer.from(k64, 'base64');
  const ct = Buffer.from(ctB64, 'base64');
  if (keyBytes.length < ct.length) throw new Error('Insufficient key material for OTP');
  const pt = Buffer.alloc(ct.length);
  for (let i = 0; i < ct.length; i++) pt[i] = ct[i] ^ keyBytes[i];
  // KME already deletes keys on dec_keys per our implementation
  return pt;
}

import { hkdfSha256 } from "./kme-client";
import { aesGcmEncrypt, aesGcmDecrypt } from "./L4_classical";
import { fetchDecKeys, fetchEncKeys } from "./kme-client";
import { Buffer } from "buffer";

export async function encryptWithKmeAes(
  kmeUrl: string,
  slaveSAE: string,
  plaintext: Buffer,
) {
  const resp = await fetchEncKeys(kmeUrl, slaveSAE, {
    number: 1,
    sizeBits: 256,
  });
  const k64 = resp.keys[0].key; // base64
  const keyBytes = Buffer.from(k64, "base64"); // length should be 32 bytes if 256 bits
  // Derive AES key from KME key (HKDF with context)
  const salt = Buffer.from("QuMail-AES-salt"); // choose deployment-unique salt
  const info = Buffer.from("QuMail-AES-derive-v1");
  const aesKey = hkdfSha256(salt, keyBytes, info, 32); // 32 bytes AES-256
  const { iv, ct, tag } = aesGcmEncrypt(plaintext, aesKey);
  // Important: mark key as consumed on KME if required
  // await consumeKey(kmeUrl, slaveSAE, resp.keys[0].key_ID);
  return {
    key_ID: resp.keys[0].key_ID,
    iv: iv.toString("base64"),
    tag: tag.toString("base64"),
    ciphertext: ct.toString("base64"),
  };
}

export async function decryptWithKmeAes(
  kmeUrl: string,
  masterSAE: string,
  cipherEnvelope: any,
) {
  // cipherEnvelope: { key_ID, iv, tag, ciphertext }
  const decResp = await fetchDecKeys(kmeUrl, masterSAE, [
    cipherEnvelope.key_ID,
  ]);
  const k64 = decResp.keys[0].key;
  const keyBytes = Buffer.from(k64, "base64");
  const salt = Buffer.from("QuMail-AES-salt");
  const info = Buffer.from("QuMail-AES-derive-v1");
  const aesKey = hkdfSha256(salt, keyBytes, info, 32);
  const pt = aesGcmDecrypt(
    Buffer.from(cipherEnvelope.ciphertext, "base64"),
    aesKey,
    Buffer.from(cipherEnvelope.iv, "base64"),
    Buffer.from(cipherEnvelope.tag, "base64"),
  );
  // Optionally, call consumeKey(...)
  return pt;
}

// classical.ts
import { randomBytes, createCipheriv, createDecipheriv } from "crypto";

export function aesGcmEncrypt(plaintext: string, key: string) {
  // key: 32 bytes for AES-256
  const iv = randomBytes(12); // 96-bit recommended for GCM
  const cipher = createCipheriv("aes-256-gcm", key, iv);
  const ct = Buffer.concat([cipher.update(plaintext), cipher.final()]);
  const tag = cipher.getAuthTag();
  return { iv, ct, tag }; // send iv and tag alongside ct
}

export function aesGcmDecrypt(
  ct: Buffer,
  key: any,
  iv: Buffer,
  tag: Buffer,
) {
  const decipher = createDecipheriv("aes-256-gcm", key, iv);
  decipher.setAuthTag(tag);
  const pt = Buffer.concat([decipher.update(ct), decipher.final()]);
  return pt;
}

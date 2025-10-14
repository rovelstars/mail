import { int, sqliteTable, text } from "drizzle-orm/sqlite-core";

export const Users = sqliteTable("users_table", {
  id: int().primaryKey({ autoIncrement: true }),
  name: text().notNull(),
  email: text().notNull().unique(),
  password: text().notNull(), // encrypted password
  preferEncryption: int().default(1), // 1-5, 1 is strongest, 5 is no encryption
  created_at: int().default(Date.now()), // timestamp
  aesKey: text().notNull(), // base64 encoded AES key for the user
});

export const Keys = sqliteTable("keys", {
  id: text().primaryKey(), // key_ID (UUID)
  key_b64: text(), // base64 key material
  size: int().notNull(),
  master_sae: text().notNull(),
  slave_sae: text().notNull(),
  created_at: int().default(Date.now()),
  additional_slaves: text({ mode: "json" }).$type<string[]>(), // JSON array
  key_context_id: text(),
  lifetime: int(), //stored as Unix epoch seconds. If lifetime is null the key does not expire.
  extension_mandatory: text({ mode: "json" }), // JSON
  extension_optional: text({ mode: "json" }), // JSON
  status: text({
    enum: ["available", "reserved", "delivered", "expired", "consumed"],
  }), // tracks lifecycle; useful for querying and admin UI
});

export const Audit = sqliteTable("audit", {
  id: text().primaryKey(), // audit id (UUID)
  key_id: text().notNull(),
  event: text({
    enum: ["generated", "reserved", "delivered", "consumed", "expired"],
  }).notNull(),
  actor: text({ enum: ["SAE", "system"] }).notNull(), // SAE or system
  info: text({ mode: "json" }), // JSON or message
  ts: int().default(Date.now()), // timestamp
}); // records events for compliance & debugging.

export const Mails = sqliteTable("mails", {
  id: text().primaryKey(), // mail id (UUID)
  from: text()
    .notNull(), // sender email, saved in our DB
  to: text({ mode: "json" }).notNull().$type<string[]>(), // JSON array of recipients. maybe or maybe not in our DB
  subject: text().notNull(),
  body: text().notNull(),
  date: int().default(Date.now()), // Unix epoch seconds
  category: text({ enum: ["primary", "spam"] }).notNull(), // primary or spam
  readBy: text({ mode: "json" }).$type<string[]>(), // JSON array of recipient emails who have read the email
  encryption: int().default(5), // type of encryption used.
  /*
    Unlike ascending order of encryption strength, here lower number means stronger encryption. We go from 1 (strongest) to 5 (weakest - no security).
    Level 1- Quantum Secure : use One Time Pad No Quantum security.
    Level 2- Quantum-aided AES: use Quantum keys as seed for AES.
    Level 3- Any other encryption (like PQC) may be given as option.
    Level 4- No Quantum security. Use AES or other classical encryption.
    Level 5- No encryption. Plaintext. Readable by other mail servers.
  */
});

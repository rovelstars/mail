import { drizzle } from "drizzle-orm/libsql";
import { createClient } from "@libsql/client";

const databaseUrl = process.env.TURSO_DATABASE_URL;
const authToken = process.env.TURSO_AUTH_TOKEN;

if (!databaseUrl || !authToken) {
  throw new Error("Missing required database environment variables");
}

const client = createClient({
  url: databaseUrl,
  authToken: authToken,
});

console.log(`☁️  [${(new Date()).toLocaleString()}] Connected to the database successfully.`);

const db = drizzle(client);
export default db;
export { Users, Keys, Audit, Mails } from "./schema";

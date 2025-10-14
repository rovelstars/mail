import { Context, Hono, Next } from "hono";
import db, { Keys, Audit } from "@/db";
import { randomUUID } from "crypto";

import { default as GET_status } from "./GET_status";
import { default as POST_enc_keys } from "./POST_enc_keys";
import { default as POST_dec_keys } from "./POST_dec_keys";
import { default as POST_reserve } from "./POST_reserve";
import { default as POST_consume_key } from "./POST_consume_key";
import { inArray } from "drizzle-orm";

const Router = new Hono();
const nowSec = () => Math.floor(Date.now() / 1000);

Router.get("/health", (c) => {
  return c.json({ status: "ok" });
});

export async function audit(
  event: string,
  keyId: string,
  actor: string,
  info: any = {},
) {
  try {
    await db.insert(Audit).values({
      //@ts-ignore
      id: randomUUID(),
      key_id: keyId,
      event,
      actor,
      info: JSON.stringify(info),
    });
  } catch (e) {
    console.error("audit failure", e);
  }
}

const CLEANUP_INTERVAL = 30; // seconds

async function cleanupExpiredKeys() {
  try {
    const now = nowSec();
    const expired = await db.select().from(Keys);
    const toExpire = expired.filter(
      (r) => r.lifetime && r.created_at && r.created_at + r.lifetime < now,
    );
    if (toExpire.length === 0) return;
    const ids = toExpire.map((r) => r.id);
    await db.delete(Keys).where(inArray(Keys.id, ids));
    for (const id of ids)
      await audit("expired", id, "system", { reason: "cleanup" });
    console.log(`cleanup: expired keys removed: ${ids.length}`);
  } catch (e) {
    console.error("cleanup error", e);
  }
}

// start interval timer (won't block server)
setInterval(cleanupExpiredKeys, CLEANUP_INTERVAL * 1000);

Router.route("/", GET_status);
Router.route("/", POST_enc_keys);
Router.route("/", POST_dec_keys);
Router.route("/", POST_reserve);
Router.route("/", POST_consume_key);

export default Router;

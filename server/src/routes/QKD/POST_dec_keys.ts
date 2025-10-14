import { Hono } from "hono";
import db, { Keys } from "@/db";
import { audit } from ".";
import { eq, inArray } from "drizzle-orm";
import { randomUUID, randomBytes } from "crypto";
const Router = new Hono();
const nowSec = () => Math.floor(Date.now() / 1000);

Router.post("/:master/dec_keys", async (c) => {
  try {
    const master = c.req.param("master");
    const body = await c.req.json();

    const ids = body.key_IDs as string[] | undefined;
    if (!ids || !ids.length)
      return c.json({ error: "key_IDs array required" }, 400);

    const rows = await db.select().from(Keys).where(inArray(Keys.id, ids));
    if (!rows.length) return c.json({ error: "no matching keys found" }, 404);

    const validRows = [];
    for (const r of rows) {
      if (r.lifetime && r.created_at && r.created_at + r.lifetime < nowSec()) {
        // expired
        await db
          .update(Keys)
          .set({ status: "expired" })
          .where(eq(Keys.id, r.id));
        await audit("expired", r.id, "system", { reason: "lifetime" });
        continue;
      }
      validRows.push(r);
    }

    if (!validRows.length)
      return c.json({ error: "no valid keys (all expired)" }, 404);

    // Prepare response and mark as delivered (or delete depending on policy)
    const responseKeys = validRows.map((r) => ({
      key_ID: r.id,
      key: r.key_b64,
    }));
    // remove them from store (post-condition)
    const idsToRemove = validRows.map((r) => r.id);
    await db.delete(Keys).where(inArray(Keys.id, idsToRemove));
    for (const id of idsToRemove) await audit("delivered", id, master, {});

    return c.json({
      source_KME_ID: "KME_A",
      target_KME_ID: "KME_B",
      master_SAE_ID: master,
      keys: responseKeys,
    });
  } catch (e) {
    console.error(e);
    return c.json({ error: "server error" }, 503);
  }
});

export default Router;

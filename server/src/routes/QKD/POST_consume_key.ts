import { Hono } from "hono";
import db, { Keys } from "@/db";
import { audit } from ".";
import { eq, inArray } from "drizzle-orm";
import { randomUUID, randomBytes } from "crypto";
const Router = new Hono();
const nowSec = () => Math.floor(Date.now() / 1000);

Router.post("/:slave/consume_key", async (c) => {
  try {
    const slave = c.req.param("slave");
    const body = await c.req.json().catch(() => ({}));
    const id = body.key_ID as string | undefined;
    if (!id) return c.json({ error: "key_ID required" }, 400);

    const row = (await db.select().from(Keys).where(eq(Keys.id, id)))[0];
    if (!row) {
      // already deleted or not found
      await audit("consume_failed", id, slave, { reason: "not found" });
      return c.json({ error: "key not found" }, 404);
    }

    // Accept consume only if not expired
    if (
      row.lifetime &&
      row.created_at &&
      row.created_at + row.lifetime < nowSec()
    ) {
      await db.update(Keys).set({ status: "expired" }).where(eq(Keys.id, id));
      await audit("expired", id, "system", { reason: "lifetime" });
      return c.json({ error: "key expired" }, 410);
    }

    // Mark consumed (we keep the row for audit, but change status)
    await db.update(Keys).set({ status: "consumed" }).where(eq(Keys.id, id));
    await audit("consumed", id, slave, {});
    return c.json({ ok: true });
  } catch (e) {
    console.error(e);
    return c.json({ error: "server error" }, 503);
  }
});

export default Router;

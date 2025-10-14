import { Hono } from "hono";
import db, { Keys } from "@/db";
import { audit } from ".";
import { randomUUID, randomBytes } from "crypto";
import { eq, inArray } from "drizzle-orm/sql";
const Router = new Hono();

const generateKeyB64 = (bits: number) =>
  Buffer.from(randomBytes(bits / 8)).toString("base64");
const nowSec = () => Math.floor(Date.now() / 1000);

// ---------- /enc_keys (Generate/Deliver New Keys) ----------
Router.post("/:slave/enc_keys", async (c) => {
  try {
    const slave = c.req.param("slave");
    const body = await c.req.json().catch(() => {
      return c.json({ error: "Invalid JSON" }, 400);
    });

    const number = Number(body.number || 1);
    const size = Number(body.size || 256);
    const lifetime = body.lifetime ? Number(body.lifetime) : null;
    const keyIDs = body.key_IDs as string[] | undefined;
    const additionalSlaves = body.additional_slave_SAE_IDs ?? [];
    const keyContextID = body.key_context_ID ?? null;
    const extMand = body.extension_mandatory ?? {};
    const extOpt = body.extension_optional ?? {};

    if (size % 8 !== 0) {
      return c.json({ error: "size must be multiple of 8 bits" }, 400);
    }
    const keysOut: Array<{ key_ID: string; key: string }> = [];

    if (Array.isArray(keyIDs) && keyIDs.length > 0) {
      // Fill provided reserved IDs
      const rows = await db.select().from(Keys).where(inArray(Keys.id, keyIDs));
      if (rows.length !== keyIDs.length) {
        return c.json({ error: "some key_IDs not found" }, 404);
      }
      for (const r of rows) {
        if (
          r.status === "expired" ||
          (r.lifetime && r.created_at && r.created_at + r.lifetime < nowSec())
        ) {
          await audit("expired", r.id, "system", { reason: "lifetime passed" });
          await db
            .update(Keys)
            .set({ status: "expired" })
            .where(eq(Keys.id, r.id));
          continue;
        }
        const k = generateKeyB64(size);
        await db
          .update(Keys)
          .set({
            key_b64: k,
            size,
            additional_slaves: JSON.stringify(additionalSlaves),
            key_context_id: keyContextID,
            lifetime,
            extension_mandatory: JSON.stringify(extMand),
            extension_optional: JSON.stringify(extOpt),
            status: "available",
          })
          .where(eq(Keys.id, r.id));
        await audit("generated", r.id, "KME_A", { size });
        keysOut.push({ key_ID: r.id, key: k });
      }
    } else {
      // Create fresh keys and return them (status delivered immediately)
      for (let i = 0; i < number; i++) {
        const id = randomUUID();
        const k = generateKeyB64(size);
        await db.insert(Keys).values({
          id,
          key_b64: k,
          size,
          master_sae: "SAE_A",
          slave_sae: slave,
          additional_slaves: JSON.stringify(additionalSlaves),
          key_context_id: keyContextID,
          lifetime,
          extension_mandatory: JSON.stringify(extMand),
          extension_optional: JSON.stringify(extOpt),
          status: "available",
          created_at: nowSec(),
        });
        await audit("generated", id, "KME_A", { size });
        keysOut.push({ key_ID: id, key: k });
      }
    }

    // Per ETSI: keys returned are considered removed from store / delivered (we'll mark as delivered and remove on dec_keys)
    // Here we can mark as 'delivered' once the SAE actually fetches or we can return them directly
    return c.json({
      keys: keysOut,
      extension_optional: { info: "keys generated successfully" },
    });
  } catch (e) {
    console.error(e);
    return c.json({ error: "server error" }, 503);
  }
});

export default Router;

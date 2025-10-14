import { Hono } from "hono";
import db, { Keys } from "@/db";
import { audit } from ".";
import { eq, inArray } from "drizzle-orm";
import { randomUUID, randomBytes } from "crypto";
const Router = new Hono();

const nowSec = () => Math.floor(Date.now() / 1000);

/* --------------------
   /reserve
   Reserve N key slots (no key material yet) and return key_IDs.
   Useful for preallocating key IDs during session setup.
   Body: { number: int, size?: int, lifetime?: epochSeconds, key_context_ID?: string, extension_optional?: {}, extension_mandatory?: {} }
   -------------------- */
Router.post("/:slave/reserve", async (c) => {
  try {
    const slave = c.req.param("slave");
    const body = await c.req.json().catch(() => {
      return c.json({ error: "Invalid JSON" }, 400);
    });
    const number = Math.max(1, Math.min(20, Number(body.number || 1)));
    const size = Number(body.size || 256);
    const lifetime = body.lifetime ? Number(body.lifetime) : null;
    const keyContextID = body.key_context_ID ?? null;
    const extMand = body.extension_mandatory ?? {};
    const extOpt = body.extension_optional ?? {};

    if (size % 8 !== 0)
      return c.json({ error: "size must be multiple of 8 bits" }, 400);

    const entries = [];
    for (let i = 0; i < number; i++) {
      const id = randomUUID();
      entries.push({
        id,
        key_b64: null,
        size,
        master_sae: "SAE_A",
        slave_sae: slave,
        additional_slaves: JSON.stringify([]),
        key_context_id: keyContextID,
        lifetime,
        extension_mandatory: JSON.stringify(extMand),
        extension_optional: JSON.stringify(extOpt),
        status: "reserved",
        created_at: nowSec(),
      });
      await db.insert(Keys).values({
        ...entries[i],
        status: "reserved" as const,
      });
      await audit("reserved", id, slave, { size, keyContextID });
    }

    return c.json({
      key_IDs: entries.map((e) => e.id),
      extension_optional: { info: "keys reserved successfully" },
    });
  } catch (e) {
    console.error(e);
    return c.json({ error: "server error" }, 503);
  }
});

export default Router;

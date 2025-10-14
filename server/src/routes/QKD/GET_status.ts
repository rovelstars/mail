import { Hono } from "hono";
import db, { Keys } from "@/db";
const Router = new Hono();

// --- GET /api/v1/keys/:slave_sae/status ---
Router.get("/:slave_sae/status", async (c) => {
  const slave = c.req.param("slave_sae");
  const keys = await db.select().from(Keys);
  const count = keys.length;

  return c.json({
    master_SAE_ID: "SAE_A",
    slave_SAE_ID: slave,
    key_size: 256,
    stored_key_count: count,
    max_key_per_request: 10,
    max_key_size: 4096,
    min_key_size: 128,
    max_SAE_ID_count: 4,
    extension_optional: { version: "1.0.0" },
  });
});
export default Router;
import { Hono } from "hono";
import db, { Users } from "@/db";
import { eq } from "drizzle-orm";
import * as crypto from "crypto";
const Router = new Hono();

Router.post("/", async (c) => {
  const { name, email, password } = await c.req.json().catch(() => {
    return { name: "", email: "", password: "" };
  });
  if (!name || !email || !password) {
    return c.json({ error: "Missing required fields" }, 400);
  }
  const existsUser = await db
    .select({id: Users.id})
    .from(Users)
    .where(eq(Users.email, email))
    .execute();
  if (existsUser.length > 0) {
    return c.json({ error: "Email already exists" }, 409);
  }
  const hashedPassword = await Bun.password.hash(password);
  const aesKey = crypto.randomBytes(24).toString("base64");
  const user = await db
    .insert(Users)
    .values({
      name,
      email,
      password: hashedPassword,
      aesKey, // 24 bytes = 32 base64 chars
      preferEncryption: 4,
    })
    .returning();
  return c.json(user);
});

export default Router;

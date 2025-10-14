import { Hono } from "hono";
import db, { Users } from "@/db";
import { eq } from "drizzle-orm";
import { sign } from "jsonwebtoken";

const Router = new Hono();

Router.post("/", async (c) => {
  const { email, password } = await c.req.json().catch(() => {
    return { email: "", password: "" };
  });
  if (!email || !password) {
    return c.json({ error: "Missing email or password" }, 400);
  }
  const user = await db
    .select({password: Users.password})
    .from(Users)
    .where(eq(Users.email, email))
    .execute();
  if (!user.length) {
    return c.json({ error: "User not found" }, 404);
  }
  const isPasswordValid = await Bun.password.verify(password, user[0].password);
  if (!isPasswordValid) {
    return c.json({ error: "Invalid password" }, 401);
  }
  const token = sign(
    { id: email },
    process.env.JWT_SECRET! ?? "TEST_KEY :) plz use jwt token - ren",
    { expiresIn: "1h" },
  );
  return c.json({
    token,
    expiry: new Date(Date.now() + 3600000).toISOString(),
    status: "success",
  });
});

export default Router;
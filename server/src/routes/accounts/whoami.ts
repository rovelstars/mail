import { Hono } from "hono";
import db, { Users } from "@/db";
import { eq } from "drizzle-orm";
import { verify } from "jsonwebtoken";

const Router = new Hono();

Router.get("/", async (c) => {
  //get jwt token from authorization header
  const authHeader = c.req.header("Authorization");
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return c.json({ error: "Missing or invalid Authorization header" }, 401);
  }
  const token = authHeader.split(" ")[1];
  try {
    const decoded = verify(
      token,
      process.env.JWT_SECRET! ?? "TEST_KEY :) plz use jwt token - ren",
    ) as { id: string; iat: number; exp: number };
    if (!decoded || !decoded.id) {
      return c.json({ error: "Invalid token" }, 401);
    }
    const user = await db
      .select({
        name: Users.name,
        preferEncryption: Users.preferEncryption,
        aesKey: Users.aesKey,
      })
      .from(Users)
      .where(eq(Users.email, decoded.id))
      .execute();
    if (!user.length) {
      return c.json({ error: "User not found" }, 404);
    }
    return c.json({
      email: decoded.id,
      name: user[0].name,
      preferEncryption: user[0].preferEncryption,
      aesKey: user[0].aesKey,
    });
  } catch (err) {
    return c.json({ error: "Invalid token" }, 401);
  }
});

export default Router;

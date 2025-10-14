import { Hono } from "hono";
import db, { Users, Mails } from "@/db";
import { eq, inArray, desc, sql } from "drizzle-orm";
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
      .select({ name: Users.name })
      .from(Users)
      .where(eq(Users.email, decoded.id))
      .execute();
    if (!user.length) {
      return c.json({ error: "User not found" }, 404);
    }
    //return outbox emails for the user
    let mails = await db
      .select()
      .from(Mails)
      .where(eq(Mails.from, decoded.id))
      .orderBy(desc(Mails.date))
      .execute();
    mails = mails.map((mail) => {
      mail.readBy = [decoded.id]; // obviously the sender has "read" the email
      //@ts-ignore
      mail.category = "outbox"; // mark category as outbox
      return mail;
    });
    console.log(`Mails fetched for user ${decoded.id}:`, mails);
    return c.json({ emails: mails });
  } catch (err) {
    return c.json({ error: "Invalid token" }, 401);
  }
});

export default Router;

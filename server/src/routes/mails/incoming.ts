import { Hono } from "hono";
import { simpleParser } from "mailparser";
import db, { Mails, Users } from "@/db";
import { eq } from "drizzle-orm";

const Router = new Hono();

Router.post("/", async (c) => {
  const authHeader = c.req.header("Authorization");
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return c.json({ error: "Missing or invalid Authorization header" }, 401);
  }
  const token = authHeader.split(" ")[1];
  if (token !== (process.env.ACCEPT_WORKER_TOKEN ?? "ACCEPT_WORKER_TOKEN")) {
    return c.json({ error: "Invalid token" }, 401);
  }
  // just log the message for now
  const { message } = await c.req.json().catch(() => ({ message: null }));
  if (!message) {
    return c.json({ error: "Missing message" }, 400);
  }
  const data = await simpleParser(message.raw).catch(() => null);
  console.log(data);
  if (!data) {
    return c.json({ error: "Failed to parse message" }, 400);
  }
  const from = data.from?.value[0]?.address;
  //@ts-ignore
  const to = data.to?.value.map((addr) => addr.address);
  if (!from || !to || !to.length) {
    return c.json({ error: "Missing from or to address" }, 400);
  }
  const subject = data.subject || "(No Subject)";
  const body = data.text || "";
  console.log(from, to);
  to.forEach(async (recipient: string) => {
    const user = await db
      .select()
      .from(Users)
      .where(eq(Users.email, recipient))
      .execute();
    console.log("Does user exist?", user);
    if (!user.length) {
      console.log(`User not found: ${recipient}`);
      return;
    }
    // insert the mail into the database
    await db
      .insert(Mails)
      .values({
        id: crypto.randomUUID(),
        category: "primary",
        encryption: 5, // no encryption
        from,
        to,
        subject,
        body,
      })
      .catch((err) => {
        console.error("Failed to insert mail:", err);
      });
    console.log(`Mail inserted for user: ${recipient}`);
  });
  return c.json({ status: "ok" });
});

export default Router;

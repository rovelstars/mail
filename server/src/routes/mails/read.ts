import { Hono } from "hono";
import db, { Users, Mails } from "@/db";
import { eq, inArray, desc, sql, and } from "drizzle-orm";
import { verify } from "jsonwebtoken";

const Router = new Hono();

Router.patch("/", async (c) => {
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
    // update the mail as read. you can append to "readBy" array in the mail object of the user email
    const { mailId, read } = await c.req.json().catch(() => ({}));
    if (!mailId) {
      return c.json({ error: "Missing mailId" }, 400);
    }
    const mail = await db
      .select()
      .from(Mails)
      .where(
        and(
          eq(Mails.id, mailId),
          sql`EXISTS (
            SELECT 1 FROM json_each(${Mails.to})
            WHERE value = ${decoded.id}
          )`,
        ),
      )
      .execute();
    if (!mail.length) {
      return c.json({ error: "Mail not found" }, 404);
    }
    const mailItem = mail[0];
    const readBy = mailItem.readBy || [];
    if (!readBy.includes(decoded.id) && read) {
      readBy.push(decoded.id);
      await db
        .update(Mails)
        .set({ readBy })
        .where(eq(Mails.id, mailId))
        .execute();
    } else if (readBy.includes(decoded.id) && !read) {
      //only remove the user email from readBy if "read" is false. keep all other emails.
      const index = readBy.indexOf(decoded.id);
      if (index > -1) {
        readBy.splice(index, 1);
        await db
          .update(Mails)
          .set({ readBy })
          .where(eq(Mails.id, mailId))
          .execute();
      }
    }
    console.log(
      `Mail ${mailId} marked as ${read ? "read" : "unread"} by ${decoded.id}`,
    );
    return c.json({ success: true });
  } catch (err) {
    return c.json({ error: "Invalid token" }, 401);
  }
});

export default Router;

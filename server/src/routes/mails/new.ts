import { Hono } from "hono";
import db, { Users, Mails } from "@/db";
import { eq } from "drizzle-orm";
import { verify } from "jsonwebtoken";
import sendEmail from "./outgoing";

const Router = new Hono();

Router.post("/", async (c) => {
  let { to, subject, body, encryption } = await c.req.json().catch(() => ({}));
  if (!to || !subject || !body || !encryption) {
    return c.json({ error: "Missing required fields" }, 400);
  }
  // Simple email format validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (typeof to === "string")
    to = to.split(",").map((email: string) => email.trim());
  if (Array.isArray(to)) to = to.map((email: string) => email.trim());
  else
    return c.json(
      { error: "Invalid 'to' field. Must be string or array." },
      400,
    );
  if (Array.isArray(to)) {
    for (const email of to) {
      if (!emailRegex.test(email)) {
        return c.json({ error: `Invalid email format: ${email}` }, 400);
      }
    }
  } else {
    if (!emailRegex.test(to)) {
      return c.json({ error: `Invalid email format: ${to}` }, 400);
    }
  }
  if (typeof subject !== "string" || subject.length > 255) {
    return c.json(
      { error: "Subject must be a string up to 255 characters" },
      400,
    );
  }
  if (encryption == 5 && (typeof body !== "string" || body.length > 5000)) {
    return c.json(
      { error: "Body must be a string up to 5000 characters" },
      400,
    );
  } else {
    body = JSON.stringify(body);
  }

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
    const result = await db
      .insert(Mails)
      .values({
        id: crypto.randomUUID(),
        from: decoded.id,
        to,
        subject,
        body,
        encryption,
        category: "primary",
      })
      .returning()
      .execute();
    //if any email in "to" is not in Users table, run sendEmail
    const existingUsers = await db
      .select({ email: Users.email, name: Users.name })
      .from(Users)
      .where(eq(Users.email, to[0])) // TODO: only checks the first email
      .execute();
    if (existingUsers.length) {
      console.log("Recipient exists in system, not sending external email");
      return c.json(
        { message: "Email sent internally", email: result[0] },
        201,
      );
    }
    console.log("Sending external email to:", to);
    const sentRes = await sendEmail({
      from: {
        email: decoded.id,
        name: user[0].name,
      },
      to,
      subject,
      text: body,
      html: `<p>${body}</p>`, //TODO: make a better html version
    });
    console.log("Email sent result:", sentRes);
    return c.json({ message: "Email sent", email: result[0] }, 201);
  } catch (err) {
    return c.json({ error: "Invalid token" }, 401);
  }
});

export default Router;

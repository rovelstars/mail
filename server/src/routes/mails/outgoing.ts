import { MailtrapClient } from "mailtrap";
import { Hono } from "hono";
const TOKEN = process.env.MAILTRAP_TOKEN;

if (!TOKEN) throw new Error("Missing MAILTRAP_TOKEN env var");

const client = new MailtrapClient({
  token: TOKEN,
});

export default function sendEmail({
  to,
  from,
  subject,
  text,
  html,
}: {
  to: string[];
  from: {
    email: string;
    name?: string;
  };
  subject: string;
  text: string;
  html?: string;
}) {
  const sender = {
    email: from.email,
    name: from.name || from.email.split("@")[0],
  };
  const recipients = to.map((email) => ({ email }));

  return client.send({
    from: sender,
    to: recipients,
    subject,
    text,
    html,
    category: "User Email",
  });
}

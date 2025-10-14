import { MailtrapClient } from "mailtrap";
const TOKEN = process.env.MAILTRAP_TOKEN;

if (!TOKEN) throw new Error("Missing MAILTRAP_TOKEN env var");

const client = new MailtrapClient({
  token: TOKEN,
});

const sender = {
  email: "hello@rovelstars.com",
  name: "Mailtrap Test",
};
const recipients = [
  {
    email: "renhiyama@rovelstars.com",
  },
];

client
  .send({
    from: sender,
    to: recipients,
    subject: "You are awesome!",
    text: "Congrats for sending test email with Mailtrap!",
    category: "Integration Test",
  })
  .then(console.log, console.error);

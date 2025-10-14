import { Hono } from "hono";
import QKDRouter from "./QKD";
import AccountsRouter from "./accounts";
import MailsRouter from "./mails";
import { simpleParser } from "mailparser";
const Router = new Hono();

Router.route("/api/v1/keys", QKDRouter);
Router.route("/api/v1/accounts", AccountsRouter);
Router.route("/api/v1/mails", MailsRouter);

Router.get("/", (c) => {
  return c.json({ hello: "world" });
});

Router.get("/health", (c) => {
  return c.json({ status: "ok" });
});

export default Router;

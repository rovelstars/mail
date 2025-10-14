import { Hono } from "hono";
import { default as Inbox } from "./inbox";
import { default as Outbox } from "./outbox";
import { default as NewMail } from "./new";
import { default as Read } from "./read";
import { default as Incoming } from "./incoming";
const Router = new Hono();

Router.route("/inbox", Inbox);
Router.route("/outbox", Outbox);
Router.route("/new", NewMail);
Router.route("/read", Read);
Router.route("/incoming", Incoming);

export default Router;

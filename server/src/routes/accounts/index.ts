import { Hono } from "hono";
import {default as Register} from "./register";
import {default as Login} from "./login";
import {default as Whoami} from "./whoami";
const Router = new Hono();

Router.route("/register", Register);
Router.route("/login", Login);
Router.route("/whoami", Whoami);

export default Router;
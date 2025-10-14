import { Hono } from "hono";
import { cors } from "hono/cors";
import { logger } from "hono/logger";
import { serve } from "bun";
import Router from "./routes";

const app = new Hono({ strict: false });
app.use(logger());
app.use(
  "/*",
  cors({
    origin: "http://localhost:1420",
  }),
);
app.route("/", Router);

serve({
  port: process.env.PORT || 3000,
  fetch: app.fetch,
});

console.log(
  `🚀 [${new Date().toLocaleString()}] Quantum KM server running on http://localhost:${process.env.PORT || 3000}`,
);

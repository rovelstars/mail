# Backend Server

To install dependencies:

```sh
bun install
```

To update DB Schema:

```sh
bun run migrate
```

To run:

```sh
bun run dev
```

then open [http://localhost:3000](http://localhost:3000)

---

Limitations:

- No access to real quantum key distribution hardware, so keys are generated with a CSPRNG (`crypto.randomBytes`), which is not secure against quantum adversaries.
- HTTPS (mTLS) is not implemented in demo product, since we currently run it behind a reverse proxy (Cloudflare + Netlify) that handles TLS termination. In a true production deployment (VPS or dedicated server), we must ensure to implement mTLS to secure communications.

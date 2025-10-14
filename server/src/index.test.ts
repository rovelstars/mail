import { expect, test } from "bun:test";

const PORT = process.env.PORT || 3000;
const DEBUG = process.env.DEBUG || false;
if (DEBUG) {
  console.log("⚠️  DEBUG mode is ON. Printing responses from server.");
}

// Simple fetch-based app to test ETSI GS QKD 014 API

const POST = (path: string, body: Object) =>
  fetch(`http://localhost:${PORT}/api/v1${path}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });

const GET = (path: string) =>
  fetch(`http://localhost:${PORT}/api/v1${path}`, {
    method: "GET",
    headers: { "Content-Type": "application/json" },
  });

console.log(`🧪 Running tests on http://localhost:${PORT}`);

test.serial("Health check", async () => {
  const res = await GET("/health");
  expect(res.status).toBe(200);
  const data = await res.json();
  expect(data).toEqual({ status: "ok" });
  DEBUG && console.log(data);
});

let cacheData: any = null;

test.serial("Generate/Deliver New Keys", async () => {
  const res = await POST("/keys/SAE_B/enc_keys", {
    number: 2,
    size: 256,
    additional_slave_SAE_IDs: ["SAE_C"],
    key_context_ID: "CTX-001",
    lifetime: 3600,
    extension_mandatory: { policy: "qkd-std" },
    extension_optional: { debug: true },
  });
  expect(res.status).toBe(200);
  const data = await res.json();
  DEBUG && console.log(data);
  expect(data.keys).toHaveLength(2);
  for (const key of data.keys) {
    expect(key).toHaveProperty("key_ID");
    expect(key).toHaveProperty("key");
    expect(typeof key.key).toBe("string");
    expect(Buffer.from(key.key, "base64").length).toBe(32); // 256 bits = 32 bytes
  }
  expect(data.extension_optional).toEqual({
    info: "keys generated successfully",
  });
  cacheData = data; // Save for next test
});

test.serial("Retrieve Keys by IDs", async () => {
  const res = await POST("/keys/SAE_A/dec_keys", {
    key_IDs: cacheData.keys.map((key: any) => key.key_ID),
  });
  expect(res.status).toBe(200);
  const data = await res.json();
  DEBUG && console.log(data);
  expect(data.keys).toHaveLength(2);
  for (const key of data.keys) {
    expect(key).toHaveProperty("key_ID");
    expect(key).toHaveProperty("key");
    expect(typeof key.key).toBe("string");
    expect(Buffer.from(key.key, "base64").length).toBe(32); // 256 bits = 32 bytes
  }
  cacheData = null;
});

test.serial("Reserve 3 key IDs", async () => {
  const res = await POST("/keys/SAE_B/reserve", {
    number: 3,
    size: 256,
    lifetime: 3600,
  });
  expect(res.status).toBe(200);
  const data = await res.json();
  DEBUG && console.log(data);
  expect(data.key_IDs).toHaveLength(3);
  for (const key of data.key_IDs) {
    expect(key).toBeString();
    expect(key).toHaveLength(36); // UUIDv4 length
    expect(key).toMatch(
      /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i,
    );
  }
  expect(data.extension_optional).toEqual({
    info: "keys reserved successfully",
  });
  cacheData = data; // Save for next test
});

test.serial("Retrieve Reserved Keys", async () => {
  const res = await POST("/keys/SAE_B/enc_keys", {
    key_IDs: cacheData.key_IDs,
  });
  expect(res.status).toBe(200);
  const data = await res.json();
  DEBUG && console.log(data);
  expect(data.keys).toHaveLength(3);
  for (const key of data.keys) {
    expect(key).toHaveProperty("key_ID");
    expect(key).toHaveProperty("key");
    expect(typeof key.key).toBe("string");
    expect(Buffer.from(key.key, "base64").length).toBe(32); // 256 bits = 32 bytes
  }
  cacheData = null;
});

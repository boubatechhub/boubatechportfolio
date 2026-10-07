import { readFileSync, writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
import { vercelSecurityHeaderEntries } from "../config/securityHeaders.mjs";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const vercelPath = join(root, "vercel.json");

const vercel = JSON.parse(readFileSync(vercelPath, "utf8"));
vercel.headers = [
  {
    source: "/(.*)",
    headers: vercelSecurityHeaderEntries,
  },
];

writeFileSync(vercelPath, `${JSON.stringify(vercel, null, 2)}\n`, "utf8");
console.log("vercel.json — en-têtes de sécurité synchronisés.");

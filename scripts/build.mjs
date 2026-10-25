import { spawnSync } from "node:child_process";
import { existsSync } from "node:fs";
import { fileURLToPath } from "node:url";

// Prisma CLI reads .env, but local development credentials live in .env.local.
// Vercel supplies the same variables through its project environment instead.
if (existsSync(".env.local") && typeof process.loadEnvFile === "function") {
  process.loadEnvFile(".env.local");
}

const prismaCli = fileURLToPath(
  new URL("../node_modules/prisma/build/index.js", import.meta.url),
);
const nextCli = fileURLToPath(
  new URL("../node_modules/next/dist/bin/next", import.meta.url),
);

for (const [label, cli, args] of [
  ["Prisma Client generation", prismaCli, ["generate"]],
  ["Next.js production build", nextCli, ["build"]],
]) {
  console.log(`\n> ${label}`);
  const result = spawnSync(process.execPath, [cli, ...args], {
    env: process.env,
    stdio: "inherit",
  });

  if (result.error) {
    console.error(result.error);
    process.exit(1);
  }

  if (result.status !== 0) {
    process.exit(result.status ?? 1);
  }
}

import { randomUUID } from "node:crypto";
import { createInterface } from "node:readline/promises";
import { stdin, stdout } from "node:process";
import { hashPassword } from "better-auth/crypto";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

function ask(label) {
  const terminal = createInterface({ input: stdin, output: stdout });
  return terminal.question(label).finally(() => terminal.close());
}

function askSecret(label) {
  if (!stdin.isTTY || typeof stdin.setRawMode !== "function") {
    throw new Error("Run this command in an interactive terminal so the password can be entered without echoing it.");
  }
  stdout.write(label);
  stdin.setRawMode(true);
  stdin.resume();
  return new Promise((resolve, reject) => {
    let value = "";
    const restore = () => {
      stdin.off("data", onData);
      stdin.setRawMode(false);
      stdout.write("\n");
    };
    const onData = (chunk) => {
      for (const char of chunk.toString("utf8")) {
        if (char === "\u0003") {
          restore();
          reject(new Error("Cancelled."));
          return;
        }
        if (char === "\r" || char === "\n") {
          restore();
          resolve(value);
          return;
        }
        if (char === "\u007f" || char === "\b") {
          if (value.length) {
            value = value.slice(0, -1);
            stdout.write("\b \b");
          }
          continue;
        }
        if (char >= " ") {
          value += char;
          stdout.write("*");
        }
      }
    };
    stdin.on("data", onData);
  });
}

try {
  const email = (process.argv[2] ?? await ask("Admin email: ")).trim().toLowerCase();
  let displayName = "";
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || email.length > 254) {
    throw new Error("Enter a valid email address.");
  }

  const existing = await prisma.user.findUnique({ where: { email }, select: { id: true, role: true } });
  if (existing) {
    const confirmation = (await ask(`This account currently has role ${existing.role}. Promote it to ADMIN and set a new password? Type PROMOTE to confirm: `)).trim();
    if (confirmation !== "PROMOTE") throw new Error("Cancelled; no account changes were made.");
  } else {
    displayName = (await ask("Admin display name: ")).trim();
    if (displayName.length < 2 || displayName.length > 80) throw new Error("Display name must be 2–80 characters.");
  }

  const password = await askSecret("New admin password (12–128 characters): ");
  if (password.length < 12 || password.length > 128) throw new Error("Password must be 12–128 characters.");
  const confirmation = await askSecret("Confirm admin password: ");
  if (password !== confirmation) throw new Error("Passwords do not match.");

  displayName = existing
    ? (await prisma.user.findUniqueOrThrow({ where: { id: existing.id }, select: { displayName: true } })).displayName
    : displayName;
  const passwordHash = await hashPassword(password);

  await prisma.$transaction(async (tx) => {
    const user = existing
      ? await tx.user.update({ where: { id: existing.id }, data: { role: "ADMIN" } })
      : await tx.user.create({ data: { email, displayName, role: "ADMIN", emailVerified: false } });
    const credential = await tx.account.findFirst({ where: { userId: user.id, providerId: "credential" }, select: { id: true } });
    if (credential) {
      await tx.account.update({ where: { id: credential.id }, data: { accountId: user.id, password: passwordHash } });
    } else {
      await tx.account.create({
        data: { id: randomUUID(), userId: user.id, accountId: user.id, providerId: "credential", password: passwordHash },
      });
    }
  });

  console.log(`Admin account is ready for ${email}. The password is stored as a Better Auth hash; it was not printed or saved to a file.`);
} catch (error) {
  console.error(error instanceof Error ? error.message : "Admin setup failed.");
  process.exitCode = 1;
} finally {
  await prisma.$disconnect();
}

import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { after } from "next/server";
import { prisma } from "@/lib/prisma";

async function sendAuthEmail(to: string, subject: string, text: string) {
  const apiKey = process.env.RESEND_API_KEY;
  const from = process.env.AUTH_EMAIL_FROM;

  if (!apiKey || !from) {
    throw new Error("Email delivery is not configured. Set RESEND_API_KEY and AUTH_EMAIL_FROM.");
  }

  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ from, to: [to], subject, text }),
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error(`Auth email delivery failed with status ${response.status}.`);
  }
}

const googleCredentials =
  process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET
    ? {
        google: {
          clientId: process.env.GOOGLE_CLIENT_ID,
          clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        },
      }
    : {};

export const auth = betterAuth({
  appName: "NOON Quran Memorization Academy",
  baseURL: process.env.BETTER_AUTH_URL,
  secret: process.env.BETTER_AUTH_SECRET,
  database: prismaAdapter(prisma, { provider: "postgresql" }),
  trustedOrigins: process.env.BETTER_AUTH_TRUSTED_ORIGINS?.split(",").map((origin) => origin.trim()),
  emailAndPassword: {
    enabled: true,
    minPasswordLength: 12,
    maxPasswordLength: 128,
    autoSignIn: true,
    requireEmailVerification: false,
    revokeSessionsOnPasswordReset: true,
    sendResetPassword: async ({ user, url }) => {
      after(async () => {
        try {
          await sendAuthEmail(
            user.email,
            "Reset your NOON Academy password",
            `Use this secure, time-limited link to reset your password: ${url}`,
          );
        } catch (error) {
          console.error("Password reset email delivery failed.", error);
        }
      });
    },
  },
  socialProviders: googleCredentials,
  account: {
    encryptOAuthTokens: true,
    accountLinking: {
      enabled: true,
      trustedProviders: ["google"],
      allowDifferentEmails: false,
    },
  },
  user: {
    fields: { name: "displayName" },
    additionalFields: {
      role: {
        type: ["STUDENT", "TEACHER", "ADMIN", "GUARDIAN"],
        required: false,
        defaultValue: "STUDENT",
        input: false,
      },
      preferredLocale: { type: "string", required: false, defaultValue: "en", input: false },
      nativeLanguage: { type: "string", required: false, input: false },
    },
  },
  databaseHooks: {
    user: {
      create: {
        after: async (user) => {
          if (user.role === "STUDENT") {
            await prisma.studentProfile.upsert({
              where: { userId: user.id },
              create: { userId: user.id, proficiency: "absolute-beginner" },
              update: {},
            });
          }
        },
      },
    },
  },
  rateLimit: {
    enabled: true,
    window: 60,
    max: 100,
    storage: "database",
    customRules: {
      "/sign-in/email": { window: 60, max: 5 },
      "/sign-up/email": { window: 3600, max: 5 },
      "/request-password-reset": { window: 3600, max: 5 },
    },
  },
  advanced: {
    useSecureCookies: process.env.NODE_ENV === "production",
  },
});

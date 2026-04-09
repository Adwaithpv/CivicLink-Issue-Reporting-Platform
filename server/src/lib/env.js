import { z } from "zod";

const EnvSchema = z.object({
  NODE_ENV: z.enum(["development", "test", "production"]).default("development"),
  PORT: z.coerce.number().int().positive().default(4000),
  MONGODB_URI: z.string().min(1),
  SESSION_SECRET: z.string().min(16),
  CLIENT_ORIGIN: z.string().min(1),
  ADMIN_EMAILS: z.string().optional().default(""),
});

const parsed = EnvSchema.safeParse(process.env);

if (!parsed.success) {
  // Keep error readable in terminal
  // eslint-disable-next-line no-console
  console.error("Invalid environment variables:", parsed.error.flatten().fieldErrors);
  throw new Error("Invalid environment variables");
}

export const env = {
  ...parsed.data,
  adminEmailsSet: new Set(
    parsed.data.ADMIN_EMAILS.split(",")
      .map((s) => s.trim().toLowerCase())
      .filter(Boolean)
  ),
};


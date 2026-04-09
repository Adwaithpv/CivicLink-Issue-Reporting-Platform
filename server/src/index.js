import dotenv from "dotenv";
dotenv.config();

import express from "express";
import session from "express-session";
import MongoStore from "connect-mongo";
import cors from "cors";

import { connectToDatabase } from "./lib/db.js";
import { env } from "./lib/env.js";
import { errorHandler } from "./middleware/error-handler.js";
import { notFoundHandler } from "./middleware/not-found.js";

import { authRouter } from "./routes/auth.js";
import { complaintsRouter } from "./routes/complaints.js";
import { adminRouter } from "./routes/admin.js";

async function main() {
  await connectToDatabase(env.MONGODB_URI);

  const app = express();

  app.set("trust proxy", 1);

  app.use(
    cors({
      origin: env.CLIENT_ORIGIN,
      credentials: true,
    })
  );

  app.use(express.json({ limit: "1mb" }));

  app.use(
    session({
      name: "civiclink.sid",
      secret: env.SESSION_SECRET,
      resave: false,
      saveUninitialized: false,
      cookie: {
        httpOnly: true,
        sameSite: "lax",
        secure: env.NODE_ENV === "production",
        maxAge: 1000 * 60 * 60 * 24 * 7,
      },
      store: MongoStore.create({
        mongoUrl: env.MONGODB_URI,
        collectionName: "sessions",
        ttl: 60 * 60 * 24 * 7,
      }),
    })
  );

  app.get("/api/health", (_req, res) => res.json({ ok: true }));

  app.use("/api/auth", authRouter);
  app.use("/api/complaints", complaintsRouter);
  app.use("/api/admin", adminRouter);

  app.use(notFoundHandler);
  app.use(errorHandler);

  app.listen(env.PORT, () => {
    // eslint-disable-next-line no-console
    console.log(`Server listening on http://localhost:${env.PORT}`);
  });
}

main().catch((err) => {
  // eslint-disable-next-line no-console
  console.error(err);
  process.exitCode = 1;
});


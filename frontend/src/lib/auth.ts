// src/lib/auth.ts
import { init } from "better-auth";
import { postgresAdapter } from "@better-auth/postgres-adapter";
import { sql } from '@vercel/postgres';

export const auth = init({
  secret: process.env.BETTER_AUTH_SECRET || 'fallback_dev_secret_change_me',
  database: postgresAdapter({
    client: sql, // Using Vercel Postgres client
  }),
  emailAndPassword: {
    enabled: true,
  },
  socialProviders: {
    // Add social providers if needed
  },
});
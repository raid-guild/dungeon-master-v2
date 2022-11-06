CREATE TABLE "public"."applications" (
  "id" uuid NOT NULL DEFAULT gen_random_uuid(),
  "name" text NOT NULL,
  "email_address" text NOT NULL,
  "discord_handle" text NOT NULL,
  "telegram_handle" text,
  "twitter_handle" text,
  "github_handle" text,
  "eth_address" text NOT NULL,
  "ens_name" text,
  "introduction" text NOT NULL DEFAULT 'NA',
  "learning_goals" text NOT NULL DEFAULT 'NA',
  "skill_type" text NOT NULL DEFAULT 'NA',
  "passion" text NOT NULL DEFAULT 'NA',
  "favorite_media" text NOT NULL DEFAULT 'NA',
  "crypto_thrills" text NOT NULL DEFAULT 'NA',
  "why_raidguild" text NOT NULL DEFAULT 'NA',
  "dao_familiarity" text NOT NULL DEFAULT 'NA',
  "availability" text NOT NULL DEFAULT 'NA',
  "crypto_experience" text NOT NULL DEFAULT 'NA',
  "comments" text,
  "handbook_read" boolean DEFAULT false,
  "pledge_readiness" boolean DEFAULT false,
  "referred_by" uuid,
  PRIMARY KEY ("id"),
  FOREIGN KEY ("skill_type") REFERENCES "public"."skill_types"("skill_type") ON UPDATE restrict ON DELETE restrict,
  FOREIGN KEY ("dao_familiarity") REFERENCES "public"."dao_familiarities"("dao_familiarity") ON UPDATE restrict ON DELETE restrict,
  FOREIGN KEY ("availability") REFERENCES "public"."cohort_availabilities"("cohort_availability") ON UPDATE restrict ON DELETE restrict,
  FOREIGN KEY ("referred_by") REFERENCES "public"."members"("id") ON UPDATE restrict ON DELETE restrict,
  UNIQUE ("id")
);
CREATE EXTENSION IF NOT EXISTS pgcrypto;

CREATE TABLE "public"."applications" (
  "id" uuid NOT NULL DEFAULT gen_random_uuid(),
  "v1_id" text,
  "name" text NOT NULL,
  "eth_address" text,
  "introduction" text,
  "learning_goals" text,
  "technical_skill_type_key" text,
  "passion" text,
  "favorite_media" text,
  "crypto_thrills" text,
  "why_raidguild" text,
  "dao_familiarity_key" text,
  "availability_key" text,
  "crypto_experience" text,
  "comments" text,
  "handbook_read" boolean DEFAULT false,
  "pledge_readiness" boolean DEFAULT false,
  "referred_by_id" uuid,
  "created_at" timestamptz NOT NULL DEFAULT NOW(),
  "updated_at" timestamptz NOT NULL DEFAULT NOW(),
  PRIMARY KEY ("id"),
  FOREIGN KEY ("technical_skill_type_key") REFERENCES "public"."technical_skill_types"("skill_type") ON UPDATE restrict ON DELETE restrict,
  FOREIGN KEY ("dao_familiarity_key") REFERENCES "public"."dao_familiarities"("dao_familiarity") ON UPDATE restrict ON DELETE restrict,
  FOREIGN KEY ("availability_key") REFERENCES "public"."cohort_availabilities"("cohort_availability") ON UPDATE restrict ON DELETE restrict,
  UNIQUE ("id")
);
CREATE EXTENSION IF NOT EXISTS pgcrypto;

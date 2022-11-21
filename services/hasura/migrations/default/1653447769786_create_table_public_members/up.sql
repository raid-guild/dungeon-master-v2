CREATE TABLE "public"."members" (
  "id" uuid NOT NULL DEFAULT gen_random_uuid(),
  "legacy_id" text,
  "v1_id" text,
  "name" text NOT NULL,
  "email_address" text NOT NULL,
  "discord_handle" text,
  "telegram_handle" text,
  "twitter_handle" text,
  "github_handle" text,
  "eth_address" text,
  "ens_name" text,
  "guild_class" text,
  "membership_date" date,
  "member_type" text,
  "is_raiding" boolean,
  "championed_by" uuid,
  "application" uuid NOT NULL,
  "application_v1" text,
  "created_at" timestamptz NOT NULL DEFAULT NOW(),
  "updated_at" timestamptz NOT NULL DEFAULT NOW(),
  PRIMARY KEY ("id") ,
  FOREIGN KEY ("guild_class") REFERENCES "public"."guild_classes"("guild_class") ON UPDATE restrict ON DELETE restrict,
  FOREIGN KEY ("member_type") REFERENCES "public"."member_types"("member_type") ON UPDATE restrict ON DELETE restrict,
  UNIQUE ("id")
);
CREATE EXTENSION IF NOT EXISTS pgcrypto;

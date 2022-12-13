CREATE TABLE "public"."contact_infos" (
  "id" uuid NOT NULL DEFAULT gen_random_uuid(),
  "email" text,
  "discord" text,
  "telegram" text,
  "twitter" text,
  "github" text,
  PRIMARY KEY ("id"),
  UNIQUE ("id")
);

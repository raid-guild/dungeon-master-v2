CREATE TABLE "public"."blogs" (
  "id" uuid NOT NULL DEFAULT gen_random_uuid(),
  "title" text,
  "slug" text,
  "author" text,
  "image" text,
  "description" text,
  "content" text,
  "tags" jsonb,
  "created_at" timestamptz NOT NULL DEFAULT NOW(),
  "updated_at" timestamptz NOT NULL DEFAULT NOW(),
  PRIMARY KEY ("id"),
  UNIQUE ("id")
);
CREATE EXTENSION IF NOT EXISTS pgcrypto;

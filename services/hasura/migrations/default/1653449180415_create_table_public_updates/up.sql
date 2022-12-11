CREATE TABLE "public"."updates" (
  "id" uuid NOT NULL DEFAULT gen_random_uuid(),
  "update" text NOT NULL,
  "member_id" uuid NOT NULL,
  "raid_id" uuid NOT NULL,
  "created_at" timestamptz NOT NULL DEFAULT NOW(),
  "updated_at" timestamptz NOT NULL DEFAULT NOW(),
  PRIMARY KEY ("id") ,
  FOREIGN KEY ("member_id") REFERENCES "public"."members"("id") ON UPDATE restrict ON DELETE restrict,
  FOREIGN KEY ("raid_id") REFERENCES "public"."raids"("id") ON UPDATE restrict ON DELETE restrict,
  UNIQUE ("id")
);
CREATE EXTENSION IF NOT EXISTS pgcrypto;

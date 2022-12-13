CREATE TABLE "public"."raid_parties" (
  "id" uuid NOT NULL DEFAULT gen_random_uuid(),
  "v1_id" text,
  "raid_id" uuid NOT NULL,
  "member_id" uuid NOT NULL,
  "created_at" date DEFAULT now(),
  "updated_at" date DEFAULT now(),
  PRIMARY KEY ("id") ,
  FOREIGN KEY ("raid_id") REFERENCES "public"."raids"("id") ON UPDATE restrict ON DELETE restrict,
  FOREIGN KEY ("member_id") REFERENCES "public"."members"("id") ON UPDATE restrict ON DELETE restrict,
  UNIQUE ("id")
);
CREATE EXTENSION IF NOT EXISTS pgcrypto;

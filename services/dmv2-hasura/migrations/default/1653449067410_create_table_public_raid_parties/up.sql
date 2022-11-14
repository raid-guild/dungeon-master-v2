CREATE TABLE "public"."raid_parties" (
  "id" uuid NOT NULL DEFAULT gen_random_uuid(),
  "v1_id" text,
  "raid" uuid NOT NULL,
  "member" uuid NOT NULL,
  "created_at" date DEFAULT now(),
  "updated_at" date DEFAULT now(),
  PRIMARY KEY ("id") ,
  FOREIGN KEY ("raid") REFERENCES "public"."raids"("id") ON UPDATE restrict ON DELETE restrict,
  FOREIGN KEY ("member") REFERENCES "public"."members"("id") ON UPDATE restrict ON DELETE restrict,
  UNIQUE ("id")
);
CREATE EXTENSION IF NOT EXISTS pgcrypto;

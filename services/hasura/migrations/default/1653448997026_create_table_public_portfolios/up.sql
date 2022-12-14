CREATE TABLE "public"."portfolios" (
  "id" uuid NOT NULL DEFAULT gen_random_uuid(),
  "name" text NOT NULL,
  "description" text,
  "category" text NOT NULL,
  "case_study" text,
  "repo_link" text,
  "result_link" text,
  "raid_id" uuid,
  PRIMARY KEY ("id") ,
  FOREIGN KEY ("category") REFERENCES "public"."raid_categories"("raid_category") ON UPDATE restrict ON DELETE restrict,
  FOREIGN KEY ("raid_id") REFERENCES "public"."raids"("id") ON UPDATE restrict ON DELETE restrict,
  UNIQUE ("id")
);
CREATE EXTENSION IF NOT EXISTS pgcrypto;

CREATE TABLE "public"."portfolios" (
  "id" uuid NOT NULL DEFAULT gen_random_uuid(),
  "project_name" text NOT NULL,
  "project_desc" text,
  "category" text NOT NULL,
  "case_study" text,
  "repo_link" text,
  "result_link" text,
  PRIMARY KEY ("id") ,
  FOREIGN KEY ("category") REFERENCES "public"."raid_categories"("raid_category") ON UPDATE restrict ON DELETE restrict,
  UNIQUE ("id")
);
CREATE EXTENSION IF NOT EXISTS pgcrypto;

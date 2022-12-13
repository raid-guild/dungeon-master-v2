CREATE TABLE "public"."clients" (
  "id" uuid NOT NULL DEFAULT gen_random_uuid(),
  "name" text,
  "website" text,
  PRIMARY KEY ("id"),
  UNIQUE ("id")
);

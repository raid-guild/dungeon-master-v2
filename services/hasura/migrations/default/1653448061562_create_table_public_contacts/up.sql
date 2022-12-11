CREATE TABLE "public"."contacts" (
  "id" uuid NOT NULL DEFAULT gen_random_uuid(),
  "name" text,
  "bio" text,
  "eth_address" text,
  PRIMARY KEY ("id"),
  UNIQUE ("id")
);

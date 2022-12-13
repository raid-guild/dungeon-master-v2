CREATE TABLE "public"."contacts" (
  "id" uuid NOT NULL DEFAULT gen_random_uuid(),
  "name" text,
  "bio" text,
  "eth_address" text,
  "contact_info_id" uuid,
  PRIMARY KEY ("id"),
  FOREIGN KEY ("contact_info_id") REFERENCES "public"."contact_infos"("id") ON UPDATE restrict ON DELETE restrict,
  UNIQUE ("id")
);

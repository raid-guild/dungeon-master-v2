CREATE TABLE "public"."members" (
  "id" uuid NOT NULL DEFAULT gen_random_uuid(),
  "legacy_id" text,
  "v1_id" text,
  "name" text NOT NULL,
  "eth_address" text,
  "primary_class_key" text,
  "membership_date" date,
  "member_type_key" text,
  "is_raiding" boolean,
  "championed_by_id" uuid,
  "application_id" uuid NOT NULL,
  "application_v1" text,
  "created_at" timestamptz NOT NULL DEFAULT NOW(),
  "updated_at" timestamptz NOT NULL DEFAULT NOW(),
  PRIMARY KEY ("id") ,
  FOREIGN KEY ("primary_class_key") REFERENCES "public"."guild_classes"("guild_class") ON UPDATE restrict ON DELETE restrict,
  FOREIGN KEY ("member_type_key") REFERENCES "public"."member_types"("member_type") ON UPDATE restrict ON DELETE restrict,
  FOREIGN KEY ("application_id") REFERENCES "public"."applications"("id") ON UPDATE restrict ON DELETE restrict,
  FOREIGN KEY ("championed_by_id") REFERENCES "public"."members"("id") ON UPDATE restrict ON DELETE restrict,
  UNIQUE ("id")
);
CREATE EXTENSION IF NOT EXISTS pgcrypto;

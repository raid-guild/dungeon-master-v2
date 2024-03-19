CREATE TABLE "public"."members_guild_classes" (
  "id" uuid NOT NULL DEFAULT gen_random_uuid(),
  "member_id" uuid,
  "guild_class_key" text NOT NULL,
  FOREIGN KEY ("guild_class_key") REFERENCES "public"."guild_classes"("guild_class") ON UPDATE restrict ON DELETE restrict,
  FOREIGN KEY ("member_id") REFERENCES "public"."members"("id") ON UPDATE restrict ON DELETE restrict,
  UNIQUE ("id"));
CREATE EXTENSION IF NOT EXISTS pgcrypto;

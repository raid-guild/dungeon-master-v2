CREATE TABLE "public"."raids_roles_required" (
  "id" uuid NOT NULL DEFAULT gen_random_uuid(),
  "raid_id" uuid NOT NULL,
  "role" text NOT NULL,
  PRIMARY KEY ("id") ,
  FOREIGN KEY ("raid_id") REFERENCES "public"."raids"("id") ON UPDATE restrict ON DELETE restrict,
  FOREIGN KEY ("role") REFERENCES "public"."guild_classes"("guild_class") ON UPDATE restrict ON DELETE restrict,
  UNIQUE ("id")
);
CREATE EXTENSION IF NOT EXISTS pgcrypto;

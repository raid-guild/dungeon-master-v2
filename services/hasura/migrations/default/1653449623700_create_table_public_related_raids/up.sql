CREATE TABLE "public"."related_raids" (
  "id" uuid NOT NULL DEFAULT gen_random_uuid(),
  "raid_id" uuid NOT NULL,
  "related_raid_id" uuid NOT NULL,
  PRIMARY KEY ("id") ,
  FOREIGN KEY ("raid_id") REFERENCES "public"."raids"("id") ON UPDATE restrict ON DELETE restrict,
  FOREIGN KEY ("related_raid_id") REFERENCES "public"."raids"("id") ON UPDATE restrict ON DELETE restrict,
  UNIQUE ("id")
);
CREATE EXTENSION IF NOT EXISTS pgcrypto;

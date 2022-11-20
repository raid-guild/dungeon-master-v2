CREATE TABLE "public"."related_raids" (
  "id" uuid NOT NULL DEFAULT gen_random_uuid(),
  "raid" uuid NOT NULL,
  "related_raid" uuid NOT NULL,
  PRIMARY KEY ("id") ,
  FOREIGN KEY ("raid") REFERENCES "public"."raids"("id") ON UPDATE restrict ON DELETE restrict,
  FOREIGN KEY ("related_raid") REFERENCES "public"."raids"("id") ON UPDATE restrict ON DELETE restrict,
  UNIQUE ("id")
);
CREATE EXTENSION IF NOT EXISTS pgcrypto;

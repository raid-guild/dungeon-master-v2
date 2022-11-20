CREATE TABLE "public"."portfolios_roles" (
  "id" uuid NOT NULL DEFAULT gen_random_uuid(),
  "portfolio" uuid NOT NULL,
  "role" text NOT NULL,
  PRIMARY KEY ("id") ,
  FOREIGN KEY ("portfolio") REFERENCES "public"."portfolios"("id") ON UPDATE restrict ON DELETE restrict,
  FOREIGN KEY ("role") REFERENCES "public"."guild_classes"("guild_class") ON UPDATE restrict ON DELETE restrict,
  UNIQUE ("id")
);
CREATE EXTENSION IF NOT EXISTS pgcrypto;

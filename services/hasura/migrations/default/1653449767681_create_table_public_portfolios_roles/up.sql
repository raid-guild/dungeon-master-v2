CREATE TABLE "public"."portfolios_roles" (
  "id" uuid NOT NULL DEFAULT gen_random_uuid(),
  "portfolio_id" uuid NOT NULL,
  "member_id" uuid,
  "role" text NOT NULL,
  PRIMARY KEY ("id") ,
  FOREIGN KEY ("portfolio_id") REFERENCES "public"."portfolios"("id") ON UPDATE restrict ON DELETE restrict,
  FOREIGN KEY ("member_id") REFERENCES "public"."members"("id") ON UPDATE restrict ON DELETE restrict,
  FOREIGN KEY ("role") REFERENCES "public"."guild_classes"("guild_class") ON UPDATE restrict ON DELETE restrict,
  UNIQUE ("id")
);
CREATE EXTENSION IF NOT EXISTS pgcrypto;

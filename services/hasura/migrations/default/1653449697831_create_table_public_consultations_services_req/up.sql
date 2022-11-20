CREATE TABLE "public"."consultations_services_req" (
  "id" uuid NOT NULL DEFAULT gen_random_uuid(),
  "consultation" uuid NOT NULL,
  "guild_service" text NOT NULL,
  PRIMARY KEY ("id") ,
  FOREIGN KEY ("consultation") REFERENCES "public"."consultations"("id") ON UPDATE restrict ON DELETE restrict,
  FOREIGN KEY ("guild_service") REFERENCES "public"."guild_services"("guild_service") ON UPDATE restrict ON DELETE restrict,
  UNIQUE ("id")
);
CREATE EXTENSION IF NOT EXISTS pgcrypto;

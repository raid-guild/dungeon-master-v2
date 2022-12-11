CREATE TABLE "public"."consultations_services_required" (
  "id" uuid NOT NULL DEFAULT gen_random_uuid(),
  "consultation_id" uuid NOT NULL,
  "guild_service_key" text NOT NULL,
  PRIMARY KEY ("id") ,
  FOREIGN KEY ("consultation_id") REFERENCES "public"."consultations"("id") ON UPDATE restrict ON DELETE restrict,
  FOREIGN KEY ("guild_service_key") REFERENCES "public"."guild_services"("guild_service") ON UPDATE restrict ON DELETE restrict,
  UNIQUE ("id")
);
CREATE EXTENSION IF NOT EXISTS pgcrypto;

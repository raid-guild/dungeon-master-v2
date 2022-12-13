CREATE TABLE "public"."consultations_clients" (
    "id" uuid NOT NULL DEFAULT gen_random_uuid(),
    "consultation_id" uuid NOT NULL,
    "client_id" uuid NOT NULL,
    PRIMARY KEY ("id"),
    FOREIGN KEY ("consultation_id") REFERENCES "public"."consultations"("id") ON UPDATE restrict ON DELETE restrict,
    FOREIGN KEY ("client_id") REFERENCES "public"."clients"("id") ON UPDATE restrict ON DELETE restrict,
    UNIQUE ("id")
);
CREATE EXTENSION IF NOT EXISTS pgcrypto;

CREATE TABLE "public"."clients_contacts" (
    "id" uuid NOT NULL DEFAULT gen_random_uuid(),
    "client_id" uuid NOT NULL,
    "contact_id" uuid NOT NULL,
    PRIMARY KEY ("id"),
    FOREIGN KEY ("client_id") REFERENCES "public"."clients"("id") ON UPDATE restrict ON DELETE restrict,
    FOREIGN KEY ("contact_id") REFERENCES "public"."contacts"("id") ON UPDATE restrict ON DELETE restrict,
    UNIQUE ("id")
);
CREATE EXTENSION IF NOT EXISTS pgcrypto;

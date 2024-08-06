CREATE TABLE "public"."invoices" ("id" uuid NOT NULL DEFAULT gen_random_uuid(), "invoice_address" text NOT NULL, "chain_id" integer NOT NULL, PRIMARY KEY ("id") , UNIQUE ("id"));
CREATE EXTENSION IF NOT EXISTS pgcrypto;

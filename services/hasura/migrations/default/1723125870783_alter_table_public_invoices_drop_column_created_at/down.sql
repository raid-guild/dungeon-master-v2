alter table "public"."invoices" alter column "created_at" set default now();
alter table "public"."invoices" alter column "created_at" drop not null;
alter table "public"."invoices" add column "created_at" time;

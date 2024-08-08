alter table "public"."invoices" add column "created_at" time
 not null default now();

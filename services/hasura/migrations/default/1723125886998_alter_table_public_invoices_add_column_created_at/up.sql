alter table "public"."invoices" add column "created_at" timestamptz
 not null default now();

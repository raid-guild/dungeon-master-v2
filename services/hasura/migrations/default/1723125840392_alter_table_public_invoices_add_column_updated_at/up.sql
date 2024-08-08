alter table "public"."invoices" add column "updated_at" timestamptz
 not null default now();

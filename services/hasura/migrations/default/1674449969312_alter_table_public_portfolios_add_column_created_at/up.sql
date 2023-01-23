alter table "public"."portfolios" add column "created_at" timestamptz
 not null default now();

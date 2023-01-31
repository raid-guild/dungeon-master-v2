alter table "public"."portfolios_roles" drop constraint "portfolios_roles_portfolio_id_fkey",
  add constraint "portfolios_roles_portfolio_id_fkey"
  foreign key ("portfolio_id")
  references "public"."portfolios"
  ("id") on update restrict on delete cascade;

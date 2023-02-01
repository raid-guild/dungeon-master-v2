alter table "public"."proposals"
  add constraint "proposals_token_fkey"
  foreign key ("token")
  references "public"."current_token_prices"
  ("id") on update restrict on delete restrict;

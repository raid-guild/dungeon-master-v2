alter table "public"."raids"
  add constraint "raids_hunter_id_fkey"
  foreign key ("hunter_id")
  references "public"."members"
  ("id") on update restrict on delete restrict;

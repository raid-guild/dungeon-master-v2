alter table "public"."updates" drop constraint "updates_member_id_fkey",
  add constraint "updates_member_id_fkey"
  foreign key ("member_id")
  references "public"."members"
  ("id") on update restrict on delete restrict;

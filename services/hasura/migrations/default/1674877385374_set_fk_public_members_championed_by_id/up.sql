alter table "public"."members" drop constraint "members_championed_by_id_fkey",
  add constraint "members_championed_by_id_fkey"
  foreign key ("championed_by_id")
  references "public"."members"
  ("id") on update restrict on delete set null;

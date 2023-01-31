alter table "public"."members" drop constraint "members_contact_info_id_fkey",
  add constraint "members_contact_info_id_fkey"
  foreign key ("contact_info_id")
  references "public"."contact_infos"
  ("id") on update restrict on delete cascade;

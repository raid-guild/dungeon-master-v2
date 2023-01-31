alter table "public"."applications" drop constraint "applications_contact_info_id_fkey",
  add constraint "applications_contact_info_id_fkey"
  foreign key ("contact_info_id")
  references "public"."contact_infos"
  ("id") on update restrict on delete restrict;

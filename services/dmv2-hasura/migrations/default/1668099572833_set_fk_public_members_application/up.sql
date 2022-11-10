alter table "public"."members"
  add constraint "members_application_fkey"
  foreign key ("application")
  references "public"."applications"
  ("id") on update restrict on delete restrict;

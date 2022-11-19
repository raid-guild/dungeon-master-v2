alter table "public"."applications" drop constraint "applications_skill_type_fkey",
  add constraint "applications_skill_type_fkey"
  foreign key ("skill_type")
  references "public"."skill_types"
  ("skill_type") on update restrict on delete restrict;

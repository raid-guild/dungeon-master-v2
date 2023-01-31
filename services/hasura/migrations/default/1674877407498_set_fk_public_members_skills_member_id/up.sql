alter table "public"."members_skills" drop constraint "members_skills_member_id_fkey",
  add constraint "members_skills_member_id_fkey"
  foreign key ("member_id")
  references "public"."members"
  ("id") on update restrict on delete cascade;

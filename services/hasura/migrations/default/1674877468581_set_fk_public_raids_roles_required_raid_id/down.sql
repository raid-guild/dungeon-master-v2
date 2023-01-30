alter table "public"."raids_roles_required" drop constraint "raids_roles_required_raid_id_fkey",
  add constraint "raids_roles_required_raid_id_fkey"
  foreign key ("raid_id")
  references "public"."raids"
  ("id") on update restrict on delete restrict;

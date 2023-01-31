alter table "public"."updates" drop constraint "updates_raid_id_fkey",
  add constraint "updates_raid_id_fkey"
  foreign key ("raid_id")
  references "public"."raids"
  ("id") on update restrict on delete restrict;

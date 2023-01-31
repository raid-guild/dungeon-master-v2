alter table "public"."related_raids" drop constraint "related_raids_raid_id_fkey",
  add constraint "related_raids_raid_id_fkey"
  foreign key ("raid_id")
  references "public"."raids"
  ("id") on update restrict on delete cascade;

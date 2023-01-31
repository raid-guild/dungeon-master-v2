alter table "public"."raid_parties" drop constraint "raid_parties_raid_id_fkey",
  add constraint "raid_parties_raid_id_fkey"
  foreign key ("raid_id")
  references "public"."raids"
  ("id") on update restrict on delete restrict;

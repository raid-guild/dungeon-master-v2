alter table "public"."raid_parties" drop constraint "raid_parties_member_id_fkey",
  add constraint "raid_parties_member_id_fkey"
  foreign key ("member_id")
  references "public"."members"
  ("id") on update restrict on delete restrict;

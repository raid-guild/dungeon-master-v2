alter table "public"."raid_parties"
  add constraint "raid_parties_raider_class_key_fkey"
  foreign key ("raider_class_key")
  references "public"."guild_classes"
  ("guild_class") on update restrict on delete restrict;

alter table "public"."consultations_services_required" drop constraint "consultations_services_required_guild_service_key_fkey",
  add constraint "consultations_services_required_guild_service_key_fkey"
  foreign key ("guild_service_key")
  references "public"."guild_services"
  ("guild_service") on update restrict on delete cascade;

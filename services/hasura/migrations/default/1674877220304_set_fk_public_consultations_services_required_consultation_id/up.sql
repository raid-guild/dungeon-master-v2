alter table "public"."consultations_services_required" drop constraint "consultations_services_required_consultation_id_fkey",
  add constraint "consultations_services_required_consultation_id_fkey"
  foreign key ("consultation_id")
  references "public"."consultations"
  ("id") on update restrict on delete cascade;

alter table "public"."consultations_clients" drop constraint "consultations_clients_consultation_id_fkey",
  add constraint "consultations_clients_consultation_id_fkey"
  foreign key ("consultation_id")
  references "public"."consultations"
  ("id") on update restrict on delete cascade;

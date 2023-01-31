alter table "public"."consultations_clients" drop constraint "consultations_clients_client_id_fkey",
  add constraint "consultations_clients_client_id_fkey"
  foreign key ("client_id")
  references "public"."clients"
  ("id") on update restrict on delete restrict;

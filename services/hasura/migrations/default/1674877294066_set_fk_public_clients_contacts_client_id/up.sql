alter table "public"."clients_contacts" drop constraint "clients_contacts_client_id_fkey",
  add constraint "clients_contacts_client_id_fkey"
  foreign key ("client_id")
  references "public"."clients"
  ("id") on update restrict on delete cascade;

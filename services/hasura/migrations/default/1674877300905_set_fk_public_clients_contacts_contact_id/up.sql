alter table "public"."clients_contacts" drop constraint "clients_contacts_contact_id_fkey",
  add constraint "clients_contacts_contact_id_fkey"
  foreign key ("contact_id")
  references "public"."contacts"
  ("id") on update restrict on delete cascade;

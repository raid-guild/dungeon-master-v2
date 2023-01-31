alter table "public"."consultations_contacts" drop constraint "consultations_contacts_contact_id_fkey",
  add constraint "consultations_contacts_contact_id_fkey"
  foreign key ("contact_id")
  references "public"."contacts"
  ("id") on update restrict on delete restrict;

alter table "public"."consultations_contacts" drop constraint "consultations_contacts_consultation_id_fkey",
  add constraint "consultations_contacts_consultation_id_fkey"
  foreign key ("consultation_id")
  references "public"."consultations"
  ("id") on update restrict on delete cascade;

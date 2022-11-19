alter table "public"."consultations"
  add constraint "consultations_delivery_priorities_fkey"
  foreign key ("delivery_priorities")
  references "public"."budget_options"
  ("budget_option") on update restrict on delete restrict;

alter table "public"."consultations"
  add constraint "consultations_budget_fkey"
  foreign key ("budget")
  references "public"."budget_options"
  ("budget_option") on update restrict on delete restrict;

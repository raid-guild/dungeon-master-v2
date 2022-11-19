alter table "public"."consultations"
  add constraint "consultations_additional_info_fkey"
  foreign key ("additional_info")
  references "public"."delivery_priorities"
  ("delivery_priority") on update restrict on delete restrict;

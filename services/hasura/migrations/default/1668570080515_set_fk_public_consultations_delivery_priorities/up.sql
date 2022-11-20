alter table "public"."consultations"
  add constraint "consultations_delivery_priorities_fkey"
  foreign key ("delivery_priorities")
  references "public"."delivery_priorities"
  ("delivery_priority") on update restrict on delete restrict;

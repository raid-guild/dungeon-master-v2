alter table "public"."raids"
  add constraint "raids_invoice_id_fkey"
  foreign key ("invoice_id")
  references "public"."invoices"
  ("id") on update restrict on delete restrict;

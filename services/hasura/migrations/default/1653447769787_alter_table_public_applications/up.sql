ALTER TABLE "public"."applications"
  ADD CONSTRAINT "applications_referred_by_id_fkey"
  FOREIGN KEY ("referred_by_id")
  REFERENCES "public"."members"
  ("id") ON UPDATE restrict ON DELETE restrict;
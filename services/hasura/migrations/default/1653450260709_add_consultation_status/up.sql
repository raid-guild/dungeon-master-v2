CREATE TABLE "public"."consultation_statuses" ("consultation_status" text NOT NULL, PRIMARY KEY ("consultation_status") );
ALTER TABLE "public"."consultations" ADD COLUMN "consultation_status" text NOT NULL;
ALTER TABLE "public"."consultations" ADD CONSTRAINT fk_consultations_consultation_statuses FOREIGN KEY ("consultation_status") REFERENCES "public"."consultation_statuses"("consultation_status") ON UPDATE restrict ON DELETE restrict;

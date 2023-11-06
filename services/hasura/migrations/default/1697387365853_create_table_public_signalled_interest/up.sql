CREATE TABLE "public"."signalled_interest" ("id" uuid NOT NULL DEFAULT gen_random_uuid(), "member_id" uuid NOT NULL, "raid_id" uuid, "consultation_id" uuid, PRIMARY KEY ("id") , FOREIGN KEY ("member_id") REFERENCES "public"."members"("id") ON UPDATE restrict ON DELETE restrict, FOREIGN KEY ("consultation_id") REFERENCES "public"."consultations"("id") ON UPDATE restrict ON DELETE restrict, FOREIGN KEY ("raid_id") REFERENCES "public"."raids"("id") ON UPDATE restrict ON DELETE restrict, UNIQUE ("id"));
CREATE EXTENSION IF NOT EXISTS pgcrypto;

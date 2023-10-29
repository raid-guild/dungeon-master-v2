CREATE TABLE "public"."links" ("id" uuid NOT NULL DEFAULT gen_random_uuid(), "raid_id" uuid, "consultation_id" uuid, "application_id" uuid, "member_id" uuid, "type" text NOT NULL DEFAULT '"OTHER"', "link" text NOT NULL, PRIMARY KEY ("id") , FOREIGN KEY ("raid_id") REFERENCES "public"."raids"("id") ON UPDATE restrict ON DELETE restrict, FOREIGN KEY ("application_id") REFERENCES "public"."applications"("id") ON UPDATE restrict ON DELETE restrict, FOREIGN KEY ("consultation_id") REFERENCES "public"."consultations"("id") ON UPDATE restrict ON DELETE restrict, FOREIGN KEY ("member_id") REFERENCES "public"."members"("id") ON UPDATE restrict ON DELETE restrict, FOREIGN KEY ("type") REFERENCES "public"."link_types"("type") ON UPDATE restrict ON DELETE restrict, UNIQUE ("id"));
CREATE EXTENSION IF NOT EXISTS pgcrypto;

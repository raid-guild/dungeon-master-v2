CREATE TABLE "public"."raid_parties" ("id" uuid NOT NULL DEFAULT gen_random_uuid(), "raid" uuid NOT NULL, "member" uuid NOT NULL, PRIMARY KEY ("id") , FOREIGN KEY ("raid") REFERENCES "public"."raids"("id") ON UPDATE restrict ON DELETE restrict, FOREIGN KEY ("member") REFERENCES "public"."members"("id") ON UPDATE restrict ON DELETE restrict, UNIQUE ("id"));
CREATE EXTENSION IF NOT EXISTS pgcrypto;

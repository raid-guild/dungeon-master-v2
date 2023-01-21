CREATE TABLE "public"."treasury_token_history" ("id" serial NOT NULL, "token_name" text NOT NULL, "date" date NOT NULL, "price_usd" numeric NOT NULL, PRIMARY KEY ("id") , UNIQUE ("id"));

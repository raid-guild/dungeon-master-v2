CREATE TABLE "public"."milestones_selections" ("id" uuid NOT NULL DEFAULT gen_random_uuid(), "milestone" integer NOT NULL, "option" uuid NOT NULL, "hours" numeric NOT NULL, "hourly" numeric NOT NULL, "min_weeks" numeric NOT NULL, "max_weeks" numeric NOT NULL, "created_at" timestamptz NOT NULL DEFAULT now(), "updated_at" timestamptz NOT NULL DEFAULT now(), PRIMARY KEY ("id") , FOREIGN KEY ("milestone") REFERENCES "public"."milestones"("id") ON UPDATE restrict ON DELETE restrict, FOREIGN KEY ("option") REFERENCES "public"."proposal_options"("id") ON UPDATE restrict ON DELETE restrict);
CREATE OR REPLACE FUNCTION "public"."set_current_timestamp_updated_at"()
RETURNS TRIGGER AS $$
DECLARE
  _new record;
BEGIN
  _new := NEW;
  _new."updated_at" = NOW();
  RETURN _new;
END;
$$ LANGUAGE plpgsql;
CREATE TRIGGER "set_public_milestones_selections_updated_at"
BEFORE UPDATE ON "public"."milestones_selections"
FOR EACH ROW
EXECUTE PROCEDURE "public"."set_current_timestamp_updated_at"();
COMMENT ON TRIGGER "set_public_milestones_selections_updated_at" ON "public"."milestones_selections" 
IS 'trigger to set value of column "updated_at" to current timestamp on row update';
CREATE EXTENSION IF NOT EXISTS pgcrypto;

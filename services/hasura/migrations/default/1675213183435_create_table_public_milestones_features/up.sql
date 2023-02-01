CREATE TABLE "public"."milestones_features" ("id" uuid NOT NULL DEFAULT gen_random_uuid(), "milestone" integer NOT NULL, "feature" uuid NOT NULL, "created_at" timestamptz NOT NULL DEFAULT now(), "updated_at" timestamptz NOT NULL DEFAULT now(), PRIMARY KEY ("id") , FOREIGN KEY ("milestone") REFERENCES "public"."milestones"("id") ON UPDATE restrict ON DELETE cascade, FOREIGN KEY ("feature") REFERENCES "public"."features"("id") ON UPDATE restrict ON DELETE cascade);
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
CREATE TRIGGER "set_public_milestones_features_updated_at"
BEFORE UPDATE ON "public"."milestones_features"
FOR EACH ROW
EXECUTE PROCEDURE "public"."set_current_timestamp_updated_at"();
COMMENT ON TRIGGER "set_public_milestones_features_updated_at" ON "public"."milestones_features" 
IS 'trigger to set value of column "updated_at" to current timestamp on row update';
CREATE EXTENSION IF NOT EXISTS pgcrypto;

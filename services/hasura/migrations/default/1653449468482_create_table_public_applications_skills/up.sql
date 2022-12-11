CREATE TABLE "public"."applications_skills" (
  "id" uuid NOT NULL DEFAULT gen_random_uuid(),
  "application_id" uuid NOT NULL,
  "skill_key" text NOT NULL,
  "skill_type_key" text NOT NULL,
  PRIMARY KEY ("id") ,
  FOREIGN KEY ("application_id") REFERENCES "public"."applications"("id") ON UPDATE restrict ON DELETE restrict,
  FOREIGN KEY ("skill_key") REFERENCES "public"."skills"("skill") ON UPDATE restrict ON DELETE restrict,
  FOREIGN KEY ("skill_type_key") REFERENCES "public"."skill_types"("skill_type") ON UPDATE restrict ON DELETE restrict,
  UNIQUE ("id")
);
CREATE EXTENSION IF NOT EXISTS pgcrypto;

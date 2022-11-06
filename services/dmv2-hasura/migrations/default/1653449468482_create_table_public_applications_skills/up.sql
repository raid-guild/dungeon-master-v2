CREATE TABLE "public"."applications_skills" (
  "id" uuid NOT NULL DEFAULT gen_random_uuid(),
  "application" uuid NOT NULL,
  "skill" text NOT NULL,
  "skill_type" text NOT NULL,
  PRIMARY KEY ("id") ,
  FOREIGN KEY ("application") REFERENCES "public"."applications"("id") ON UPDATE restrict ON DELETE restrict,
  FOREIGN KEY ("skill") REFERENCES "public"."skills"("skill") ON UPDATE restrict ON DELETE restrict,
  FOREIGN KEY ("skill_type") REFERENCES "public"."skill_types"("skill_type") ON UPDATE restrict ON DELETE restrict,
  UNIQUE ("id")
);
CREATE EXTENSION IF NOT EXISTS pgcrypto;

CREATE TABLE "public"."members_skills" (
    "id" uuid NOT NULL DEFAULT gen_random_uuid(),
    "member_id" uuid NOT NULL,
    "skill_key" text NOT NULL,
    "skill_type_key" text NOT NULL,
    PRIMARY KEY ("id"),
    FOREIGN KEY ("member_id") REFERENCES "public"."members"("id") ON UPDATE restrict ON DELETE restrict,
    FOREIGN KEY ("skill_key") REFERENCES "public"."skills"("skill") ON UPDATE restrict ON DELETE restrict,
    FOREIGN KEY ("skill_type_key") REFERENCES "public"."skill_types"("skill_type") ON UPDATE restrict ON DELETE restrict, UNIQUE ("id"));
CREATE EXTENSION IF NOT EXISTS pgcrypto;

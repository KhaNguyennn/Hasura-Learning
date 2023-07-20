CREATE TABLE "public"."course" ("id" uuid NOT NULL DEFAULT gen_random_uuid(), "coursename" text NOT NULL, PRIMARY KEY ("id") );
CREATE EXTENSION IF NOT EXISTS pgcrypto;

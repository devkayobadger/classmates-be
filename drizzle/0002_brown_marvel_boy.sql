CREATE TYPE "public"."user_role" AS ENUM('teacher', 'admin');--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "role" "user_role" DEFAULT 'teacher' NOT NULL;
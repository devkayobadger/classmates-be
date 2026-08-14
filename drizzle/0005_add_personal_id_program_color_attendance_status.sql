ALTER TYPE "public"."attendance_status" ADD VALUE 'late';--> statement-breakpoint
ALTER TYPE "public"."attendance_status" ADD VALUE 'excused';--> statement-breakpoint
ALTER TABLE "subjects" ADD COLUMN "program" text DEFAULT '' NOT NULL;--> statement-breakpoint
ALTER TABLE "subjects" ADD COLUMN "color" text DEFAULT 'blue' NOT NULL;--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "personal_id" text;
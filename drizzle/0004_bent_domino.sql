ALTER TABLE "students" ADD COLUMN "registration_no" text NOT NULL;--> statement-breakpoint
ALTER TABLE "students" ADD CONSTRAINT "students_registration_no_unique" UNIQUE("registration_no");
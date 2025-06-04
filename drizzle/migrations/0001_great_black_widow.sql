ALTER TABLE "organisation" DROP CONSTRAINT "organisation_user_id_users_id_fk";
--> statement-breakpoint
ALTER TABLE "organisation" ALTER COLUMN "user_id" SET DATA TYPE text;--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "organisation" ADD CONSTRAINT "organisation_user_id_users_google_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("google_id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;

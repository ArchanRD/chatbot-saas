ALTER TABLE "users" DROP CONSTRAINT "users_organisation_id_organisation_id_fk";
--> statement-breakpoint
ALTER TABLE "organisation" ADD COLUMN "user_id" uuid;--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "organisation" ADD CONSTRAINT "organisation_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
ALTER TABLE "users" DROP COLUMN IF EXISTS "organisation_id";
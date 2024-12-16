ALTER TABLE "collaborators" RENAME COLUMN "user_id" TO "user_email";--> statement-breakpoint
ALTER TABLE "collaborators" DROP CONSTRAINT "collaborators_user_id_users_id_fk";
--> statement-breakpoint
ALTER TABLE "invitations" DROP CONSTRAINT "invitations_userId_users_id_fk";
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "collaborators" ADD CONSTRAINT "collaborators_user_email_users_email_fk" FOREIGN KEY ("user_email") REFERENCES "public"."users"("email") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
ALTER TABLE "invitations" DROP COLUMN IF EXISTS "userId";
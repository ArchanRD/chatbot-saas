ALTER TABLE "invitations" DROP CONSTRAINT "invitations_emai_unique";--> statement-breakpoint
ALTER TABLE "invitations" ADD COLUMN "email" text NOT NULL;--> statement-breakpoint
ALTER TABLE "invitations" DROP COLUMN IF EXISTS "emai";--> statement-breakpoint
ALTER TABLE "invitations" ADD CONSTRAINT "invitations_email_unique" UNIQUE("email");
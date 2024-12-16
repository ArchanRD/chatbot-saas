CREATE TABLE IF NOT EXISTS "invitations" (
	"id" uuid PRIMARY KEY DEFAULT uuid_generate_v4() NOT NULL,
	"emai" text NOT NULL,
	"orgId" uuid,
	"token" text,
	"role" text,
	"expires_at" timestamp NOT NULL,
	"status" text DEFAULT 'PENDING' NOT NULL,
	CONSTRAINT "invitations_emai_unique" UNIQUE("emai")
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "invitations" ADD CONSTRAINT "invitations_orgId_organisation_id_fk" FOREIGN KEY ("orgId") REFERENCES "public"."organisation"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;

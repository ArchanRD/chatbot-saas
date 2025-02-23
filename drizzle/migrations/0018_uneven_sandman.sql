CREATE TABLE IF NOT EXISTS "embeddings" (
	"id" uuid PRIMARY KEY DEFAULT uuid_generate_v4() NOT NULL,
	"file_id" uuid,
	"embedding" vector(768),
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "embeddings" ADD CONSTRAINT "embeddings_file_id_files_id_fk" FOREIGN KEY ("file_id") REFERENCES "public"."files"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
ALTER TABLE "organisation" ADD CONSTRAINT "organisation_api_key_unique" UNIQUE("api_key");
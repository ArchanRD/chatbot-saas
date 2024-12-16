ALTER TABLE "chatbots" DROP CONSTRAINT "chatbots_api_key_unique";--> statement-breakpoint
ALTER TABLE "chatbots" ADD COLUMN "welcome_mesg" text DEFAULT 'Hey! How can I help you?';--> statement-breakpoint
ALTER TABLE "organisation" ADD COLUMN "api_key" text;--> statement-breakpoint
ALTER TABLE "chatbots" DROP COLUMN IF EXISTS "api_key";--> statement-breakpoint
ALTER TABLE "chatbots" DROP COLUMN IF EXISTS "settings";
-- Add logo_url column to chatbots table
ALTER TABLE "chatbots" ADD COLUMN IF NOT EXISTS "logo_url" text;

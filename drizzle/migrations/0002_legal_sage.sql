ALTER TABLE "chatbots" ADD COLUMN "tone" text DEFAULT 'friendly';--> statement-breakpoint
ALTER TABLE "chatbots" ADD COLUMN "answer_style" text DEFAULT 'concise';--> statement-breakpoint
ALTER TABLE "chatbots" ADD COLUMN "theme" jsonb DEFAULT '{"primary_color":"#4F46E5","secondary_color":"#FFFFFF","font_family":"Inter","font_size":"medium","border_radius":8,"chat_position":"bottom-right"}'::jsonb;
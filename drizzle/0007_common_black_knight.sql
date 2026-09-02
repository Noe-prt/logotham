CREATE TABLE IF NOT EXISTS "logo_templates" (
	"id" text PRIMARY KEY NOT NULL,
	"slug" text NOT NULL,
	"name" text NOT NULL,
	"description" text NOT NULL,
	"category" text NOT NULL,
	"tags" text[] NOT NULL,
	"config" jsonb NOT NULL,
	"seo_title" text NOT NULL,
	"seo_description" text NOT NULL,
	"seo_keywords" text[] NOT NULL,
	"featured" boolean DEFAULT false NOT NULL,
	"sort_order" integer DEFAULT 0 NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "logo_templates_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "logo_templates_slug_idx" ON "logo_templates" USING btree ("slug");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "logo_templates_category_idx" ON "logo_templates" USING btree ("category");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "logo_templates_featured_idx" ON "logo_templates" USING btree ("featured");
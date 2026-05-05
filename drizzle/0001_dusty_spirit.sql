CREATE TABLE "items" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"name" text NOT NULL,
	"category" text NOT NULL,
	"price" text NOT NULL,
	"is_active" boolean DEFAULT true NOT NULL,
	"description" text
);

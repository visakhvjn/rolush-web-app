CREATE TYPE "public"."order_status" AS ENUM('new', 'confirmed', 'in_progress', 'ready', 'completed', 'cancelled');--> statement-breakpoint
CREATE TABLE "orders" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"customer_name" text NOT NULL,
	"phone" text NOT NULL,
	"email" text,
	"event_date" text,
	"message" text NOT NULL,
	"image_url" text,
	"status" "order_status" DEFAULT 'new' NOT NULL,
	"admin_notes" text,
	"source" text DEFAULT 'web' NOT NULL
);

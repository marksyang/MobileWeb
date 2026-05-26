CREATE TABLE "brands" (
	"id" varchar(50) PRIMARY KEY NOT NULL,
	"name" varchar(100) NOT NULL,
	"logo" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE "phones" (
	"id" varchar(100) PRIMARY KEY NOT NULL,
	"name" varchar(200) NOT NULL,
	"brand_id" varchar(50) NOT NULL,
	"image" text NOT NULL,
	"images" jsonb DEFAULT '[]'::jsonb NOT NULL,
	"msrp" integer NOT NULL,
	"price" integer NOT NULL,
	"ranking" integer,
	"specs" jsonb NOT NULL,
	"review_links" jsonb DEFAULT '[]'::jsonb NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "phones" ADD CONSTRAINT "phones_brand_id_brands_id_fk" FOREIGN KEY ("brand_id") REFERENCES "public"."brands"("id") ON DELETE no action ON UPDATE no action;
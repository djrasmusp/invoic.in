CREATE TABLE "companies" (
	"id" bigint PRIMARY KEY NOT NULL,
	"user_id" bigint NOT NULL,
	"name" text NOT NULL,
	"address" text NOT NULL,
	"postcode" text NOT NULL,
	"city" text NOT NULL,
	"phone" text NOT NULL,
	"identity" text NOT NULL,
	"logo" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp,
	"deleted_at" timestamp
);
--> statement-breakpoint
DROP INDEX "emailUniqueIndex";--> statement-breakpoint
ALTER TABLE "companies" ADD CONSTRAINT "user_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "companyIndex" ON "companies" USING btree ("id","user_id");--> statement-breakpoint
CREATE INDEX "companyUserIndex" ON "companies" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "credentialIndex" ON "credentials" USING btree ("id");--> statement-breakpoint
CREATE INDEX "userIndex" ON "users" USING btree ("id","deleted_at");--> statement-breakpoint
CREATE UNIQUE INDEX "emailUniqueIndex" ON "users" USING btree (lower(
    "email"
    ));
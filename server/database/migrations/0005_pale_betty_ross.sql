ALTER TABLE "clients" DROP CONSTRAINT "clients_company_id_companies_id_fk";
--> statement-breakpoint
ALTER TABLE "companies" DROP CONSTRAINT "companies_user_id_users_id_fk";
--> statement-breakpoint
ALTER TABLE "credentials" DROP CONSTRAINT "credentials_user_id_users_id_fk";
--> statement-breakpoint
ALTER TABLE "clients" ADD CONSTRAINT "company_fk" FOREIGN KEY ("company_id") REFERENCES "public"."companies"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "companies" ADD CONSTRAINT "user_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
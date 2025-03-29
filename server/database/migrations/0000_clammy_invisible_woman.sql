CREATE TYPE "public"."typesenum" AS ENUM('item', 'discount');--> statement-breakpoint
CREATE TABLE "clients" (
	"id" bigint PRIMARY KEY NOT NULL,
	"company_id" bigint NOT NULL,
	"name" text NOT NULL,
	"address" text,
	"postalCode" text,
	"city" text,
	"phone" text,
	"email" text,
	"identity" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp,
	"deleted_at" timestamp
);
--> statement-breakpoint
CREATE TABLE "companies" (
	"id" bigint PRIMARY KEY NOT NULL,
	"user_id" bigint NOT NULL,
	"name" text NOT NULL,
	"address" text NOT NULL,
	"postalCode" text NOT NULL,
	"city" text NOT NULL,
	"phone" text NOT NULL,
	"identity" text NOT NULL,
	"logo" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp,
	"deleted_at" timestamp
);
--> statement-breakpoint
CREATE TABLE "expense_files" (
	"id" bigint PRIMARY KEY NOT NULL,
	"expense_id" bigint NOT NULL,
	"file" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp,
	"deleted_at" timestamp
);
--> statement-breakpoint
CREATE TABLE "expense_types" (
	"id" bigint PRIMARY KEY NOT NULL,
	"company_id" bigint NOT NULL,
	"name" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp,
	"deleted_at" timestamp
);
--> statement-breakpoint
CREATE TABLE "expenses" (
	"id" bigint PRIMARY KEY NOT NULL,
	"company_id" bigint NOT NULL,
	"type_id" bigint,
	"name" text NOT NULL,
	"tax" bigint DEFAULT 0 NOT NULL,
	"total" bigint DEFAULT 0 NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp,
	"deleted_at" timestamp
);
--> statement-breakpoint
CREATE TABLE "credentials" (
	"id" text NOT NULL,
	"user_id" bigint NOT NULL,
	"publicKey" text NOT NULL,
	"counter" integer NOT NULL,
	"backed_up" integer NOT NULL,
	"transports" text NOT NULL,
	CONSTRAINT "credentials_id_user_id_pk" PRIMARY KEY("id","user_id"),
	CONSTRAINT "credentials_id_unique" UNIQUE("id"),
	CONSTRAINT "credentials_publicKey_unique" UNIQUE("publicKey")
);
--> statement-breakpoint
CREATE TABLE "users" (
	"id" bigint PRIMARY KEY NOT NULL,
	"email" text NOT NULL,
	"password" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp,
	"deleted_at" timestamp,
	CONSTRAINT "users_email_unique" UNIQUE("email")
);
--> statement-breakpoint
CREATE TABLE "invoices_items" (
	"id" bigint PRIMARY KEY NOT NULL,
	"invoice_id" bigint NOT NULL,
	"type" "typesenum" DEFAULT 'item' NOT NULL,
	"name" text NOT NULL,
	"description" text,
	"quantity" integer DEFAULT 1 NOT NULL,
	"price" bigint DEFAULT 0 NOT NULL,
	"tax" bigint DEFAULT 0 NOT NULL
);
--> statement-breakpoint
CREATE TABLE "invoices" (
	"id" bigint PRIMARY KEY NOT NULL,
	"company_id" bigint NOT NULL,
	"client_id" bigint NOT NULL,
	"invoice_date" date NOT NULL,
	"due_date" date NOT NULL,
	"total_tax_amount" bigint DEFAULT 0 NOT NULL,
	"total_amount" bigint DEFAULT 0 NOT NULL,
	"sent_at" timestamp,
	"viewed_at" timestamp,
	"paid_at" timestamp,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp,
	"deleted_at" timestamp
);
--> statement-breakpoint
ALTER TABLE "clients" ADD CONSTRAINT "company_fk" FOREIGN KEY ("company_id") REFERENCES "public"."companies"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "companies" ADD CONSTRAINT "user_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "expense_files" ADD CONSTRAINT "expense_fk" FOREIGN KEY ("expense_id") REFERENCES "public"."expenses"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "expense_types" ADD CONSTRAINT "company_fk" FOREIGN KEY ("company_id") REFERENCES "public"."companies"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "expenses" ADD CONSTRAINT "company_fk" FOREIGN KEY ("company_id") REFERENCES "public"."companies"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "expenses" ADD CONSTRAINT "type_fk" FOREIGN KEY ("type_id") REFERENCES "public"."expense_types"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "credentials" ADD CONSTRAINT "user_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "invoices_items" ADD CONSTRAINT "invoice_fk" FOREIGN KEY ("invoice_id") REFERENCES "public"."invoices"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "invoices" ADD CONSTRAINT "company_fk" FOREIGN KEY ("company_id") REFERENCES "public"."companies"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "invoices" ADD CONSTRAINT "client_fk" FOREIGN KEY ("client_id") REFERENCES "public"."clients"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "clientIndex" ON "clients" USING btree ("id","deleted_at");--> statement-breakpoint
CREATE INDEX "clientCompanyIndex" ON "clients" USING btree ("company_id","deleted_at");--> statement-breakpoint
CREATE INDEX "companyIndex" ON "companies" USING btree ("id","deleted_at");--> statement-breakpoint
CREATE INDEX "companyUserIndex" ON "companies" USING btree ("user_id","deleted_at");--> statement-breakpoint
CREATE INDEX "expenseFileIndex" ON "expense_files" USING btree ("expense_id","deleted_at");--> statement-breakpoint
CREATE INDEX "expenseTypeIndex" ON "expense_types" USING btree ("id","deleted_at");--> statement-breakpoint
CREATE INDEX "expenseIndex" ON "expenses" USING btree ("id","deleted_at");--> statement-breakpoint
CREATE INDEX "expenseCompanyIndex" ON "expenses" USING btree ("company_id","deleted_at");--> statement-breakpoint
CREATE INDEX "credentialIndex" ON "credentials" USING btree ("id");--> statement-breakpoint
CREATE UNIQUE INDEX "emailUniqueIndex" ON "users" USING btree (lower(
    "email"
    ));--> statement-breakpoint
CREATE INDEX "userIndex" ON "users" USING btree ("id","deleted_at");--> statement-breakpoint
CREATE INDEX "invoiceItemIndex" ON "invoices_items" USING btree ("invoice_id");--> statement-breakpoint
CREATE INDEX "invoiceIndex" ON "invoices" USING btree ("id","deleted_at");
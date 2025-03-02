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
ALTER TABLE "credentials" ADD CONSTRAINT "user_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE UNIQUE INDEX "emailUniqueIndex" ON "users" USING btree (lower(
    "email"
    ),"id");
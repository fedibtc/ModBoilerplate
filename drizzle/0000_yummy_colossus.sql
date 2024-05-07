CREATE TABLE IF NOT EXISTS "Session" (
	"id" serial PRIMARY KEY NOT NULL,
	"userId" integer NOT NULL,
	"token" text NOT NULL,
	"sigToken" text NOT NULL,
	CONSTRAINT "Session_id_unique" UNIQUE("id"),
	CONSTRAINT "Session_userId_unique" UNIQUE("userId"),
	CONSTRAINT "Session_token_unique" UNIQUE("token"),
	CONSTRAINT "Session_sigToken_unique" UNIQUE("sigToken")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "User" (
	"id" serial PRIMARY KEY NOT NULL,
	"pubkey" text NOT NULL,
	"timeCreated" timestamp(3) with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "User_id_unique" UNIQUE("id"),
	CONSTRAINT "User_pubkey_unique" UNIQUE("pubkey")
);
--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "idx_session_user_id" ON "Session" ("userId");--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "Session" ADD CONSTRAINT "Session_userId_User_id_fk" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;

CREATE TABLE "user_role_history" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" text NOT NULL,
	"previous_role" "user_role" NOT NULL,
	"new_role" "user_role" NOT NULL,
	"changed_by" text NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "user_role_history" ADD CONSTRAINT "user_role_history_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user_role_history" ADD CONSTRAINT "user_role_history_changed_by_users_id_fk" FOREIGN KEY ("changed_by") REFERENCES "public"."users"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "user_role_history_user_idx" ON "user_role_history" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "user_role_history_changed_by_idx" ON "user_role_history" USING btree ("changed_by");
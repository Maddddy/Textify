-- Create messages table
CREATE TABLE IF NOT EXISTS "public"."messages" (
  "id" uuid NOT NULL DEFAULT gen_random_uuid(),
  "chat_id" uuid NOT NULL,
  "user_id" uuid NOT NULL,
  "content" text NOT NULL,
  "role" text NOT NULL,
  "created_at" timestamptz NOT NULL DEFAULT now(),
  PRIMARY KEY ("id")
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS "messages_chat_id_idx" ON "public"."messages" ("chat_id");
CREATE INDEX IF NOT EXISTS "messages_user_id_idx" ON "public"."messages" ("user_id");
CREATE INDEX IF NOT EXISTS "messages_created_at_idx" ON "public"."messages" ("created_at");

-- Add foreign key constraints
ALTER TABLE "public"."messages" ADD CONSTRAINT "messages_chat_id_fkey" 
  FOREIGN KEY ("chat_id") REFERENCES "public"."chats" ("id") ON DELETE CASCADE;

ALTER TABLE "public"."messages" ADD CONSTRAINT "messages_user_id_fkey" 
  FOREIGN KEY ("user_id") REFERENCES "auth"."users" ("id") ON DELETE CASCADE;

-- Enable Row Level Security
ALTER TABLE "public"."messages" ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for messages
CREATE POLICY "Users can view messages from their chats" ON "public"."messages"
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM "public"."chats" 
      WHERE "chats"."id" = "messages"."chat_id" 
      AND "chats"."user_id" = auth.uid()
    )
  );

CREATE POLICY "Users can insert messages to their chats" ON "public"."messages"
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM "public"."chats" 
      WHERE "chats"."id" = "messages"."chat_id" 
      AND "chats"."user_id" = auth.uid()
    )
  );

CREATE POLICY "Users can update their own messages" ON "public"."messages"
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own messages" ON "public"."messages"
  FOR DELETE USING (auth.uid() = user_id);

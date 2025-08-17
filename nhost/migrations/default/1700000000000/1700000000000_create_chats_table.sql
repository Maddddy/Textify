-- Create chats table
CREATE TABLE IF NOT EXISTS "public"."chats" (
  "id" uuid NOT NULL DEFAULT gen_random_uuid(),
  "title" text NOT NULL,
  "user_id" uuid NOT NULL,
  "created_at" timestamptz NOT NULL DEFAULT now(),
  "updated_at" timestamptz NOT NULL DEFAULT now(),
  PRIMARY KEY ("id")
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS "chats_user_id_idx" ON "public"."chats" ("user_id");
CREATE INDEX IF NOT EXISTS "chats_updated_at_idx" ON "public"."chats" ("updated_at");

-- Add foreign key constraint to auth.users
ALTER TABLE "public"."chats" ADD CONSTRAINT "chats_user_id_fkey" 
  FOREIGN KEY ("user_id") REFERENCES "auth"."users" ("id") ON DELETE CASCADE;

-- Enable Row Level Security
ALTER TABLE "public"."chats" ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
CREATE POLICY "Users can view their own chats" ON "public"."chats"
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own chats" ON "public"."chats"
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own chats" ON "public"."chats"
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own chats" ON "public"."chats"
  FOR DELETE USING (auth.uid() = user_id);

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger for updated_at
CREATE TRIGGER update_chats_updated_at 
  BEFORE UPDATE ON "public"."chats" 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Seed data for development and testing
-- This will only run if the tables exist and are empty

-- Insert sample chat if chats table is empty
INSERT INTO "public"."chats" (id, title, user_id, created_at, updated_at)
SELECT 
  gen_random_uuid(),
  'Welcome to Textify!',
  u.id,
  now(),
  now()
FROM "auth"."users" u
WHERE NOT EXISTS (SELECT 1 FROM "public"."chats")
LIMIT 1;

-- Insert sample message if messages table is empty
INSERT INTO "public"."messages" (id, chat_id, user_id, content, role, created_at)
SELECT 
  gen_random_uuid(),
  c.id,
  c.user_id,
  'Hello! I am your AI assistant. How can I help you today?',
  'assistant',
  now()
FROM "public"."chats" c
WHERE NOT EXISTS (SELECT 1 FROM "public"."messages")
LIMIT 1;

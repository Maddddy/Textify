-- Migration: create chats and messages with safe RLS and trigger

-- Create chats table
CREATE TABLE IF NOT EXISTS public.chats (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    title TEXT NOT NULL DEFAULT 'New Chat',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create messages table
CREATE TABLE IF NOT EXISTS public.messages (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    chat_id UUID NOT NULL REFERENCES public.chats(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    content TEXT NOT NULL,
    is_bot BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_chats_user_id ON public.chats(user_id);
CREATE INDEX IF NOT EXISTS idx_messages_chat_id ON public.messages(chat_id);
CREATE INDEX IF NOT EXISTS idx_messages_user_id ON public.messages(user_id);

-- Enable RLS
ALTER TABLE public.chats ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if any
DROP POLICY IF EXISTS "Users can view their own chats" ON public.chats;
DROP POLICY IF EXISTS "Users can insert their own chats" ON public.chats;
DROP POLICY IF EXISTS "Users can update their own chats" ON public.chats;
DROP POLICY IF EXISTS "Users can delete their own chats" ON public.chats;

DROP POLICY IF EXISTS "Users can view messages from their chats" ON public.messages;
DROP POLICY IF EXISTS "Users can insert messages to their chats" ON public.messages;
DROP POLICY IF EXISTS "Users can update messages from their chats" ON public.messages;
DROP POLICY IF EXISTS "Users can delete messages from their chats" ON public.messages;

-- Create policies
CREATE POLICY "Users can view their own chats" ON public.chats
    FOR SELECT USING (
        current_setting('request.headers.x-hasura-user-id')::uuid = user_id
    );

CREATE POLICY "Users can insert their own chats" ON public.chats
    FOR INSERT WITH CHECK (
        current_setting('request.headers.x-hasura-user-id')::uuid = user_id
    );

CREATE POLICY "Users can update their own chats" ON public.chats
    FOR UPDATE USING (
        current_setting('request.headers.x-hasura-user-id')::uuid = user_id
    );

CREATE POLICY "Users can delete their own chats" ON public.chats
    FOR DELETE USING (
        current_setting('request.headers.x-hasura-user-id')::uuid = user_id
    );

CREATE POLICY "Users can view messages from their chats" ON public.messages
    FOR SELECT USING (
        EXISTS (
            SELECT 1
            FROM public.chats
            WHERE chats.id = messages.chat_id
            AND chats.user_id = current_setting('request.headers.x-hasura-user-id')::uuid
        )
    );

CREATE POLICY "Users can insert messages to their chats" ON public.messages
    FOR INSERT WITH CHECK (
        EXISTS (
            SELECT 1
            FROM public.chats
            WHERE chats.id = messages.chat_id
            AND chats.user_id = current_setting('request.headers.x-hasura-user-id')::uuid
        )
    );

CREATE POLICY "Users can update messages from their chats" ON public.messages
    FOR UPDATE USING (
        EXISTS (
            SELECT 1
            FROM public.chats
            WHERE chats.id = messages.chat_id
            AND chats.user_id = current_setting('request.headers.x-hasura-user-id')::uuid
        )
    );

CREATE POLICY "Users can delete messages from their chats" ON public.messages
    FOR DELETE USING (
        EXISTS (
            SELECT 1
            FROM public.chats
            WHERE chats.id = messages.chat_id
            AND chats.user_id = current_setting('request.headers.x-hasura-user-id')::uuid
        )
    );

-- Function to auto-update updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger for updated_at
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_trigger WHERE tgname = 'update_chats_updated_at'
    ) THEN
        CREATE TRIGGER update_chats_updated_at
            BEFORE UPDATE ON public.chats
            FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
    END IF;
END;
$$;

-- Create custom types and functions for the application

-- Ensure jsonb type is available (should be available by default in PostgreSQL)
-- If needed, we can create a domain for JSON type compatibility

-- Create function to handle message processing
CREATE OR REPLACE FUNCTION process_message(
  p_chat_id uuid,
  p_user_id uuid,
  p_content text,
  p_role text
) RETURNS uuid AS $$
DECLARE
  v_message_id uuid;
BEGIN
  -- Insert the message
  INSERT INTO "public"."messages" (chat_id, user_id, content, role)
  VALUES (p_chat_id, p_user_id, p_content, p_role)
  RETURNING id INTO v_message_id;
  
  -- Update the chat's updated_at timestamp
  UPDATE "public"."chats" 
  SET updated_at = now() 
  WHERE id = p_chat_id;
  
  RETURN v_message_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Grant execute permission to authenticated users
GRANT EXECUTE ON FUNCTION process_message(uuid, uuid, text, text) TO authenticated;

-- Create function to get chat messages with proper ordering
CREATE OR REPLACE FUNCTION get_chat_messages(p_chat_id uuid)
RETURNS TABLE (
  id uuid,
  content text,
  role text,
  created_at timestamptz,
  user_id uuid
) AS $$
BEGIN
  RETURN QUERY
  SELECT m.id, m.content, m.role, m.created_at, m.user_id
  FROM "public"."messages" m
  INNER JOIN "public"."chats" c ON m.chat_id = c.id
  WHERE m.chat_id = p_chat_id 
    AND c.user_id = auth.uid()
  ORDER BY m.created_at ASC;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Grant execute permission to authenticated users
GRANT EXECUTE ON FUNCTION get_chat_messages(uuid) TO authenticated;

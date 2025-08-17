import React, { createContext, useContext, ReactNode, useState, useEffect } from 'react';
import { useQuery, useMutation, useSubscription } from '@apollo/client';
import { gql } from '@apollo/client';
import { useAuth } from './AuthContext';

const GET_CHATS = gql`
  query GetChats($user_id: uuid!) {
    chats(where: { user_id: { _eq: $user_id } }, order_by: { updated_at: desc }) {
      id
      title
      created_at
      updated_at
      user_id
    }
  }
`;

const GET_MESSAGES = gql`
  subscription GetMessages($chat_id: uuid!) {
    messages(where: { chat_id: { _eq: $chat_id } }, order_by: { created_at: asc }) {
      id
      content
      role
      created_at
      user_id
      chat_id
    }
  }
`;

const CREATE_CHAT = gql`
  mutation CreateChat($title: String!, $user_id: uuid!) {
    insert_chats_one(object: { title: $title, user_id: $user_id }) {
      id
      title
      created_at
      updated_at
      user_id
    }
  }
`;

const SEND_MESSAGE = gql`
  mutation SendMessage($chat_id: uuid!, $message: String!) {
    sendMessage(chat_id: $chat_id, message: $message) {
      success
      data
      error
    }
  }
`;

interface Chat {
  id: string;
  title: string;
  created_at: string;
  updated_at: string;
  user_id: string;
}

interface Message {
  id: string;
  content: string;
  role: string;
  created_at: string;
  user_id: string;
  chat_id: string;
}

interface ChatContextType {
  chats: Chat[];
  currentChat: Chat | null;
  messages: Message[];
  loading: boolean;
  createChat: (title: string) => Promise<void>;
  sendMessage: (chatId: string, message: string) => Promise<void>;
  selectChat: (chat: Chat) => void;
  refreshChats: () => void;
}

const ChatContext = createContext<ChatContextType | undefined>(undefined);

export const useChat = () => {
  const context = useContext(ChatContext);
  if (context === undefined) {
    throw new Error('useChat must be used within a ChatProvider');
  }
  return context;
};

interface ChatProviderProps {
  children: ReactNode;
}

export const ChatProvider: React.FC<ChatProviderProps> = ({ children }) => {
  const { isAuthenticated, user } = useAuth();
  const [currentChat, setCurrentChat] = useState<Chat | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);

  // Query for chats
  const { data: chatsData, loading: chatsLoading, refetch: refetchChats } = useQuery(GET_CHATS, {
    variables: { user_id: user?.id || '' },
    skip: !isAuthenticated || !user?.id,
    fetchPolicy: 'cache-and-network',
  });

  // Subscription for messages
  const { data: messagesData, loading: messagesLoading } = useSubscription(GET_MESSAGES, {
    variables: { chat_id: currentChat?.id || '' },
    skip: !currentChat?.id || !isAuthenticated,
  });

  // Mutations
  const [createChatMutation] = useMutation(CREATE_CHAT);
  const [sendMessageMutation] = useMutation(SEND_MESSAGE);

  // Update messages when subscription data changes
  useEffect(() => {
    if (messagesData?.messages) {
      setMessages(messagesData.messages);
    }
  }, [messagesData]);

  const createChat = async (title: string) => {
    if (!user?.id) {
      console.error('User not authenticated');
      return;
    }

    try {
      const result = await createChatMutation({
        variables: { title, user_id: user.id },
        update: (cache, { data }) => {
          if (data?.insert_chats_one) {
            const existingChats = cache.readQuery({ 
              query: GET_CHATS, 
              variables: { user_id: user.id } 
            });
            if (existingChats && typeof existingChats === 'object' && 'chats' in existingChats) {
              const chats = (existingChats as any).chats || [];
              cache.writeQuery({
                query: GET_CHATS,
                variables: { user_id: user.id },
                data: {
                  chats: [data.insert_chats_one, ...chats],
                },
              });
            }
          }
        },
      });
      
      if (result.data?.insert_chats_one) {
        setCurrentChat(result.data.insert_chats_one);
        setMessages([]);
      }
    } catch (error) {
      console.error('Error creating chat:', error);
      throw error;
    }
  };

  const sendMessage = async (chatId: string, message: string) => {
    try {
      await sendMessageMutation({
        variables: { chat_id: chatId, message },
      });
    } catch (error) {
      console.error('Error sending message:', error);
      throw error;
    }
  };

  const selectChat = (chat: Chat) => {
    setCurrentChat(chat);
  };

  const refreshChats = () => {
    refetchChats();
  };

  const value: ChatContextType = {
    chats: chatsData?.chats || [],
    currentChat,
    messages,
    loading: chatsLoading || messagesLoading,
    createChat,
    sendMessage,
    selectChat,
    refreshChats,
  };

  return (
    <ChatContext.Provider value={value}>
      {children}
    </ChatContext.Provider>
  );
};

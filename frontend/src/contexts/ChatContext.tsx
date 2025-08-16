import React, { createContext, useContext, ReactNode, useState, useEffect } from 'react';
import { useQuery, useMutation, useSubscription } from '@apollo/client';
import { gql } from '@apollo/client';
import { useAuth } from './AuthContext';

const GET_CHATS = gql`
  query GetChats {
    chats(order_by: { updated_at: desc }) {
      id
      title
      created_at
      updated_at
    }
  }
`;

const GET_MESSAGES = gql`
  subscription GetMessages($chat_id: uuid!) {
    messages(where: { chat_id: { _eq: $chat_id } }, order_by: { created_at: asc }) {
      id
      content
      is_bot
      created_at
      user_id
    }
  }
`;

const CREATE_CHAT = gql`
  mutation CreateChat($title: String!) {
    insert_chats_one(object: { title: $title }) {
      id
      title
      created_at
      updated_at
    }
  }
`;

const SEND_MESSAGE = gql`
  mutation SendMessage($chat_id: uuid!, $message: String!) {
    sendMessage(chat_id: $chat_id, message: $message) {
      success
      message
      chat_id
    }
  }
`;

interface Chat {
  id: string;
  title: string;
  created_at: string;
  updated_at: string;
}

interface Message {
  id: string;
  content: string;
  is_bot: boolean;
  created_at: string;
  user_id: string;
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
  const { isAuthenticated } = useAuth();
  const [currentChat, setCurrentChat] = useState<Chat | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);

  // Query for chats
  const { data: chatsData, loading: chatsLoading, refetch: refetchChats } = useQuery(GET_CHATS, {
    skip: !isAuthenticated,
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
    try {
      const result = await createChatMutation({
        variables: { title },
        update: (cache, { data }) => {
          if (data?.insert_chats_one) {
            const existingChats = cache.readQuery({ query: GET_CHATS });
            if (existingChats && typeof existingChats === 'object' && 'chats' in existingChats) {
              const chats = (existingChats as any).chats || [];
              cache.writeQuery({
                query: GET_CHATS,
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
    }
  };

  const sendMessage = async (chatId: string, message: string) => {
    try {
      await sendMessageMutation({
        variables: { chat_id: chatId, message },
      });
    } catch (error) {
      console.error('Error sending message:', error);
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

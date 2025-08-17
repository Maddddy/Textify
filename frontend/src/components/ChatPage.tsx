import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useChat } from '../contexts/ChatContext';
import ChatList from './ChatList';
import MessageView from './MessageView';
import NewChatModal from './NewChatModal';
import './ChatPage.css';

const ChatPage: React.FC = () => {
  const { signOut, user } = useAuth();
  const { currentChat, createChat } = useChat();
  const [showNewChatModal, setShowNewChatModal] = useState(false);

  const handleNewChat = async (title: string) => {
    await createChat(title);
    setShowNewChatModal(false);
  };

  return (
    <div className="chat-page">
      <header className="chat-header">
        <div className="header-content">
          <h1 className="header-title">Textify Chatbot</h1>
          <div className="header-actions">
            <button
              onClick={() => setShowNewChatModal(true)}
              className="new-chat-button"
            >
              New Chat
            </button>
            <div className="user-info">
              <span className="user-email">{user?.email}</span>
              <button onClick={signOut} className="signout-button">
                Sign Out
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="chat-content">
        <aside className="chat-sidebar">
          <ChatList />
        </aside>
        
        <main className="chat-main">
          {currentChat ? (
            <MessageView />
          ) : (
            <div className="welcome-message">
              <h2>Welcome to Textify Chatbot!</h2>
              <p>Start a new chat or select an existing one to begin.</p>
              <button
                onClick={() => setShowNewChatModal(true)}
                className="welcome-new-chat-button"
              >
                Start New Chat
              </button>
            </div>
          )}
        </main>
      </div>

      {showNewChatModal && (
        <NewChatModal
          onClose={() => setShowNewChatModal(false)}
          onSubmit={handleNewChat}
        />
      )}
    </div>
  );
};

export default ChatPage;

import React from 'react';
import { useChat } from '../contexts/ChatContext';
import './ChatList.css';

const ChatList: React.FC = () => {
  const { chats, currentChat, selectChat, loading } = useChat();

  if (loading) {
    return (
      <div className="chat-list">
        <div className="chat-list-header">
          <h3>Chats</h3>
        </div>
        <div className="loading-chats">Loading chats...</div>
      </div>
    );
  }

  return (
    <div className="chat-list">
      <div className="chat-list-header">
        <h3>Chats</h3>
      </div>
      
      <div className="chat-list-content">
        {chats.length === 0 ? (
          <div className="no-chats">
            <p>No chats yet</p>
            <p>Start a new conversation!</p>
          </div>
        ) : (
          chats.map((chat) => (
            <div
              key={chat.id}
              className={`chat-item ${currentChat?.id === chat.id ? 'active' : ''}`}
              onClick={() => selectChat(chat)}
            >
              <div className="chat-item-content">
                <h4 className="chat-title">{chat.title}</h4>
                <p className="chat-date">
                  {new Date(chat.updated_at).toLocaleDateString()}
                </p>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default ChatList;

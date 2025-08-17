import React from 'react';
import './Message.css';

interface MessageProps {
  message: {
    id: string;
    content: string;
    role: string;
    created_at: string;
    user_id: string;
  };
}

const Message: React.FC<MessageProps> = ({ message }) => {
  const isBot = message.role === 'assistant';
  const messageTime = new Date(message.created_at).toLocaleTimeString();

  return (
    <div className={`message ${isBot ? 'bot-message' : 'user-message'}`}>
      <div className="message-content">
        <div className="message-text">{message.content}</div>
        <div className="message-time">{messageTime}</div>
      </div>
    </div>
  );
};

export default Message;

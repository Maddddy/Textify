import React, { useState } from 'react';
import './NewChatModal.css';

interface NewChatModalProps {
  onClose: () => void;
  onSubmit: (title: string) => void;
}

const NewChatModal: React.FC<NewChatModalProps> = ({ onClose, onSubmit }) => {
  const [title, setTitle] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (title.trim()) {
      onSubmit(title.trim());
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h3>Start New Chat</h3>
          <button onClick={onClose} className="close-button">
            ×
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="modal-form">
          <div className="form-group">
            <label htmlFor="chat-title">Chat Title</label>
            <input
              type="text"
              id="chat-title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter chat title..."
              className="form-input"
              autoFocus
            />
          </div>
          
          <div className="modal-actions">
            <button type="button" onClick={onClose} className="cancel-button">
              Cancel
            </button>
            <button
              type="submit"
              disabled={!title.trim()}
              className="create-button"
            >
              Create Chat
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default NewChatModal;

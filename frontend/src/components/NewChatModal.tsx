import React, { useState } from 'react';
import './NewChatModal.css';

interface NewChatModalProps {
  onClose: () => void;
  onSubmit: (title: string) => Promise<void>;
}

const NewChatModal: React.FC<NewChatModalProps> = ({ onClose, onSubmit }) => {
  const [title, setTitle] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (title.trim()) {
      setLoading(true);
      setError('');
      try {
        await onSubmit(title.trim());
        onClose();
      } catch (err: any) {
        setError(err.message || 'Failed to create chat');
      } finally {
        setLoading(false);
      }
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
              disabled={loading}
            />
          </div>
          
          {error && <div className="error-message">{error}</div>}
          
          <div className="modal-actions">
            <button type="button" onClick={onClose} className="cancel-button" disabled={loading}>
              Cancel
            </button>
            <button
              type="submit"
              disabled={!title.trim() || loading}
              className="create-button"
            >
              {loading ? 'Creating...' : 'Create Chat'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default NewChatModal;

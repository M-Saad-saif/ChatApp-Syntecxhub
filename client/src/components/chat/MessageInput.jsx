import { useState, useRef, useCallback } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useChat } from '../../context/ChatContext';
import { getSocket } from '../../utils/socket';
import './MessageInput.css';

export default function MessageInput() {
  const { user }       = useAuth();
  const { activeChat, sendMessage } = useChat();

  const [text, setText]           = useState('');
  const [isTyping, setIsTyping]   = useState(false);
  const typingTimerRef            = useRef(null);

  const emitTyping = useCallback((typing) => {
    const socket = getSocket();
    if (!socket || !activeChat) return;

    const event = typing ? 'typing:start' : 'typing:stop';
    if (activeChat.type === 'dm') {
      const receiver = activeChat.data.participants?.find((p) => p._id !== user._id);
      socket.emit(event, { conversationId: activeChat.data._id, receiverId: receiver?._id });
    } else {
      socket.emit(event, { groupId: activeChat.data._id });
    }
  }, [activeChat, user]);

  const handleChange = (e) => {
    setText(e.target.value);

    // Emit typing:start once, then debounce typing:stop
    if (!isTyping) {
      setIsTyping(true);
      emitTyping(true);
    }
    clearTimeout(typingTimerRef.current);
    typingTimerRef.current = setTimeout(() => {
      setIsTyping(false);
      emitTyping(false);
    }, 1500);
  };

  const handleSend = () => {
    if (!text.trim()) return;
    sendMessage(text.trim());
    setText('');
    clearTimeout(typingTimerRef.current);
    if (isTyping) {
      setIsTyping(false);
      emitTyping(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="message-input-bar">
      <textarea
        className="message-textarea"
        placeholder="Type a message..."
        value={text}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        rows={1}
      />
      <button
        className={`send-btn ${text.trim() ? 'active' : ''}`}
        onClick={handleSend}
        disabled={!text.trim()}
        aria-label="Send message"
      >
        <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
          <path d="M2 21l21-9L2 3v7l15 2-15 2z" />
        </svg>
      </button>
    </div>
  );
}

import { useRef, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useChat } from '../../context/ChatContext';
import ChatHeader from './ChatHeader';
import MessageBubble from './MessageBubble';
import MessageInput from './MessageInput';
import './ChatWindow.css';

export default function ChatWindow() {
  const { user }             = useAuth();
  const { messages, activeChat, loadingMessages, typingUsers } = useChat();
  const bottomRef            = useRef(null);

  // Auto-scroll to bottom on new message
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const chatKey = activeChat?.data?._id;
  const isTyping = typingUsers[chatKey]?.length > 0;

  return (
    <div className="chat-window">
      <ChatHeader />

      <div className="messages-area">
        {loadingMessages ? (
          <div className="messages-loading">
            <span className="loading-dots"><span /><span /><span /></span>
          </div>
        ) : messages.length === 0 ? (
          <div className="messages-empty">
            <p>No messages yet. Say hello! 👋</p>
          </div>
        ) : (
          <>
            {messages.map((msg, i) => (
              <MessageBubble
                key={msg._id}
                message={msg}
                isOwn={msg.sender._id === user._id || msg.sender === user._id}
                showAvatar={
                  i === 0 ||
                  messages[i - 1]?.sender?._id !== msg.sender?._id
                }
              />
            ))}
            {isTyping && (
              <div className="typing-indicator">
                <span className="typing-dots"><span /><span /><span /></span>
                <span className="typing-text">typing...</span>
              </div>
            )}
          </>
        )}
        <div ref={bottomRef} />
      </div>

      <MessageInput />
    </div>
  );
}

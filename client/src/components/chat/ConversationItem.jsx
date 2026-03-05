import { useAuth } from '../../context/AuthContext';
import { getInitials, getAvatarColor, formatConversationTime } from '../../utils/helpers';
import './ConversationItem.css';

export default function ConversationItem({ conversation, currentUser, onlineUsers, isActive, onClick }) {
  const other = conversation.participants.find((p) => p._id !== currentUser._id);
  if (!other) return null;

  const isOnline = onlineUsers.includes(other._id);
  const lastMsg  = conversation.lastMessage;

  return (
    <button className={`conv-item ${isActive ? 'active' : ''}`} onClick={onClick}>
      <div className="avatar-wrap">
        <span
          className="avatar avatar-md"
          style={{ background: getAvatarColor(other.username), color: '#fff' }}
        >
          {getInitials(other.username)}
        </span>
        {isOnline && <span className="avatar-online-dot" />}
      </div>

      <div className="conv-info">
        <div className="conv-row">
          <span className="conv-name">{other.username}</span>
          {lastMsg && (
            <span className="conv-time">{formatConversationTime(lastMsg.createdAt)}</span>
          )}
        </div>
        <div className="conv-preview">
          {lastMsg
            ? <span>{lastMsg.sender?._id === currentUser._id ? 'You: ' : ''}{lastMsg.text}</span>
            : <span className="no-msg">Start a conversation</span>
          }
        </div>
      </div>
    </button>
  );
}

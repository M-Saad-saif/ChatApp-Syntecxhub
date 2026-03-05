import { getInitials, getAvatarColor, formatMessageTime } from '../../utils/helpers';
import './MessageBubble.css';

export default function MessageBubble({ message, isOwn, showAvatar }) {
  const senderName = message.sender?.username || 'Unknown';

  return (
    <div className={`bubble-row ${isOwn ? 'own' : 'other'}`}>
      {!isOwn && (
        <div className="bubble-avatar-slot">
          {showAvatar ? (
            <span
              className="avatar avatar-sm"
              style={{ background: getAvatarColor(senderName), color: '#fff', flexShrink: 0 }}
            >
              {getInitials(senderName)}
            </span>
          ) : (
            <span style={{ width: 32, display: 'inline-block' }} />
          )}
        </div>
      )}

      <div className="bubble-content">
        {!isOwn && showAvatar && (
          <span className="bubble-sender">{senderName}</span>
        )}
        <div className={`bubble ${isOwn ? 'bubble-out' : 'bubble-in'}`}>
          <span className="bubble-text">{message.text}</span>
        </div>
        <span className="bubble-time">
          {formatMessageTime(message.createdAt)}
          {isOwn && (
            <span className="bubble-read" title={message.readBy?.length > 1 ? 'Seen' : 'Sent'}>
              {message.readBy?.length > 1 ? ' ✓✓' : ' ✓'}
            </span>
          )}
        </span>
      </div>
    </div>
  );
}

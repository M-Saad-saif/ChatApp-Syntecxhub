import { getInitials, getAvatarColor, formatConversationTime } from '../../utils/helpers';
import './ConversationItem.css';

export default function GroupItem({ group, isActive, onClick }) {
  const lastMsg = group.lastMessage;

  return (
    <button className={`conv-item ${isActive ? 'active' : ''}`} onClick={onClick}>
      <span
        className="avatar avatar-md"
        style={{ background: getAvatarColor(group.name), color: '#fff', borderRadius: '8px' }}
      >
        {getInitials(group.name)}
      </span>

      <div className="conv-info">
        <div className="conv-row">
          <span className="conv-name">{group.name}</span>
          {lastMsg && (
            <span className="conv-time">{formatConversationTime(lastMsg.createdAt)}</span>
          )}
        </div>
        <div className="conv-preview">
          {lastMsg
            ? <span>{lastMsg.sender?.username}: {lastMsg.text}</span>
            : <span className="no-msg">{group.members.length} members</span>
          }
        </div>
      </div>
    </button>
  );
}

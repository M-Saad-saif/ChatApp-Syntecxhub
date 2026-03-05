import { useAuth } from '../../context/AuthContext';
import { useChat } from '../../context/ChatContext';
import { getInitials, getAvatarColor, formatLastSeen } from '../../utils/helpers';
import './ChatHeader.css';

export default function ChatHeader() {
  const { user }            = useAuth();
  const { activeChat, onlineUsers } = useChat();

  if (!activeChat) return null;

  const isDM    = activeChat.type === 'dm';
  const isGroup = activeChat.type === 'group';

  let name, subtitle, color;

  if (isDM) {
    const other = activeChat.data.participants?.find((p) => p._id !== user._id);
    name     = other?.username || 'Unknown';
    color    = getAvatarColor(name);
    const isOnline = onlineUsers.includes(other?._id);
    subtitle = isOnline ? 'Online' : formatLastSeen(other?.lastSeen);
  } else {
    name     = activeChat.data.name;
    color    = getAvatarColor(name);
    subtitle = `${activeChat.data.members?.length || 0} members`;
  }

  return (
    <header className="chat-header">
      <div className="chat-header-info">
        <div className="avatar-wrap">
          <span
            className="avatar avatar-md"
            style={{
              background: color, color: '#fff',
              borderRadius: isGroup ? '8px' : '50%',
            }}
          >
            {getInitials(name)}
          </span>
          {isDM && onlineUsers.includes(
            activeChat.data.participants?.find((p) => p._id !== user._id)?._id
          ) && <span className="avatar-online-dot" />}
        </div>
        <div>
          <div className="chat-header-name">{name}</div>
          <div className={`chat-header-sub ${isDM && onlineUsers.includes(
            activeChat.data.participants?.find(p => p._id !== user._id)?._id
          ) ? 'online' : ''}`}>
            {subtitle}
          </div>
        </div>
      </div>
    </header>
  );
}

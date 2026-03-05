import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useChat } from '../../context/ChatContext';
import api from '../../utils/api';
import ConversationItem from './ConversationItem';
import GroupItem from './GroupItem';
import CreateGroupModal from './CreateGroupModal';
import UserDropdown from './UserDropdown';
import { getInitials, getAvatarColor } from '../../utils/helpers';
import './Sidebar.css';

export default function Sidebar({ darkMode, onToggleDark }) {
  const { user, logout } = useAuth();
  const { conversations, groups, onlineUsers, openDM, openGroup, activeChat } = useChat();

  const [tab, setTab]               = useState('chats'); // 'chats' | 'groups'
  const [search, setSearch]         = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [showGroupModal, setShowGroupModal] = useState(false);
  const [showDropdown, setShowDropdown]     = useState(false);

  // Search users as user types
  useEffect(() => {
    if (!search.trim()) { setSearchResults([]); return; }
    const timer = setTimeout(async () => {
      const { data } = await api.get(`/users/search?q=${search}`);
      setSearchResults(data.users);
    }, 300);
    return () => clearTimeout(timer);
  }, [search]);

  const handleUserClick = async (targetUser) => {
    await openDM(targetUser);
    setSearch('');
    setSearchResults([]);
    setTab('chats');
  };

  return (
    <aside className="sidebar">
      {/* Header */}
      <div className="sidebar-header">
        <div className="sidebar-logo">Relay</div>
        <div className="sidebar-header-actions">
          <button
            className="btn btn-icon btn-ghost"
            onClick={onToggleDark}
            title={darkMode ? 'Light mode' : 'Dark mode'}
          >
            {darkMode ? '☀️' : '🌙'}
          </button>
          <div className="sidebar-avatar-wrap">
            <button
              className="avatar avatar-sm"
              style={{ background: getAvatarColor(user?.username), color: '#fff', border: 'none', cursor: 'pointer' }}
              onClick={() => setShowDropdown((v) => !v)}
            >
              {getInitials(user?.username)}
            </button>
            {showDropdown && (
              <UserDropdown user={user} onLogout={logout} onClose={() => setShowDropdown(false)} />
            )}
          </div>
        </div>
      </div>

      {/* Search */}
      <div className="sidebar-search">
        <div className="search-wrap">
          <span className="search-icon">🔍</span>
          <input
            className="search-input"
            placeholder="Search people..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          {search && (
            <button className="search-clear" onClick={() => { setSearch(''); setSearchResults([]); }}>✕</button>
          )}
        </div>
      </div>

      {/* Search results dropdown */}
      {searchResults.length > 0 && (
        <div className="search-results">
          {searchResults.map((u) => (
            <button key={u._id} className="search-result-item" onClick={() => handleUserClick(u)}>
              <span
                className="avatar avatar-sm"
                style={{ background: getAvatarColor(u.username), color: '#fff' }}
              >
                {getInitials(u.username)}
              </span>
              <div>
                <div className="search-result-name">{u.username}</div>
                <div className="search-result-email">{u.email}</div>
              </div>
              {onlineUsers.includes(u._id) && <span className="online-pill">Online</span>}
            </button>
          ))}
        </div>
      )}

      {/* Tabs */}
      <div className="sidebar-tabs">
        <button
          className={`sidebar-tab ${tab === 'chats' ? 'active' : ''}`}
          onClick={() => setTab('chats')}
        >
          Chats
        </button>
        <button
          className={`sidebar-tab ${tab === 'groups' ? 'active' : ''}`}
          onClick={() => setTab('groups')}
        >
          Groups
        </button>
      </div>

      {/* List */}
      <div className="sidebar-list">
        {tab === 'chats' && (
          conversations.length === 0
            ? <p className="sidebar-empty">No conversations yet.<br />Search for someone to start chatting.</p>
            : conversations.map((c) => (
                <ConversationItem
                  key={c._id}
                  conversation={c}
                  currentUser={user}
                  onlineUsers={onlineUsers}
                  isActive={activeChat?.type === 'dm' && activeChat.data._id === c._id}
                  onClick={() => {
                    const other = c.participants.find((p) => p._id !== user._id);
                    if (other) openDM(other);
                  }}
                />
              ))
        )}

        {tab === 'groups' && (
          <>
            <button className="create-group-btn" onClick={() => setShowGroupModal(true)}>
              <span>+</span> New group
            </button>
            {groups.length === 0
              ? <p className="sidebar-empty">No groups yet.<br />Create one above.</p>
              : groups.map((g) => (
                  <GroupItem
                    key={g._id}
                    group={g}
                    isActive={activeChat?.type === 'group' && activeChat.data._id === g._id}
                    onClick={() => openGroup(g)}
                  />
                ))
            }
          </>
        )}
      </div>

      {showGroupModal && (
        <CreateGroupModal onClose={() => setShowGroupModal(false)} />
      )}
    </aside>
  );
}

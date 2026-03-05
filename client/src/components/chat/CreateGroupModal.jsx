import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useChat } from '../../context/ChatContext';
import { getSocket } from '../../utils/socket';
import api from '../../utils/api';
import { getInitials, getAvatarColor } from '../../utils/helpers';
import './CreateGroupModal.css';

export default function CreateGroupModal({ onClose }) {
  const { user }           = useAuth();
  const { setGroups, loadConversations } = useChat();

  const [name, setName]             = useState('');
  const [search, setSearch]         = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [selected, setSelected]     = useState([]);
  const [loading, setLoading]       = useState(false);
  const [error, setError]           = useState('');

  useEffect(() => {
    if (!search.trim()) { setSearchResults([]); return; }
    const t = setTimeout(async () => {
      const { data } = await api.get(`/users/search?q=${search}`);
      setSearchResults(data.users);
    }, 300);
    return () => clearTimeout(t);
  }, [search]);

  const toggleUser = (u) => {
    setSelected((prev) =>
      prev.find((x) => x._id === u._id) ? prev.filter((x) => x._id !== u._id) : [...prev, u]
    );
  };

  const handleCreate = async () => {
    if (!name.trim()) return setError('Group name is required');
    if (selected.length < 1) return setError('Add at least 1 member');

    setLoading(true);
    setError('');
    try {
      const { data } = await api.post('/groups', {
        name: name.trim(),
        memberIds: selected.map((u) => u._id),
      });

      // Join the new group's socket room
      const socket = getSocket();
      if (socket) socket.emit('group:join', { groupId: data.group._id });

      setGroups((prev) => [data.group, ...prev]);
      onClose();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create group');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="modal">
        <h2 className="modal-title">Create group</h2>

        {error && <div className="auth-error" style={{ marginBottom: 12 }}>{error}</div>}

        <div className="form-group">
          <label>Group name</label>
          <input
            className="input"
            placeholder="e.g. Design Team"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>

        <div className="form-group">
          <label>Add members</label>
          <input
            className="input"
            placeholder="Search by name..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        {searchResults.length > 0 && (
          <div className="group-search-results">
            {searchResults.map((u) => {
              const isSelected = !!selected.find((x) => x._id === u._id);
              return (
                <button
                  key={u._id}
                  className={`group-user-row ${isSelected ? 'selected' : ''}`}
                  onClick={() => toggleUser(u)}
                >
                  <span
                    className="avatar avatar-sm"
                    style={{ background: getAvatarColor(u.username), color: '#fff' }}
                  >
                    {getInitials(u.username)}
                  </span>
                  <span className="group-user-name">{u.username}</span>
                  {isSelected && <span className="group-check">✓</span>}
                </button>
              );
            })}
          </div>
        )}

        {selected.length > 0 && (
          <div className="group-selected">
            {selected.map((u) => (
              <span key={u._id} className="group-tag">
                {u.username}
                <button onClick={() => toggleUser(u)}>✕</button>
              </span>
            ))}
          </div>
        )}

        <div className="modal-actions">
          <button className="btn btn-ghost" onClick={onClose}>Cancel</button>
          <button className="btn btn-primary" onClick={handleCreate} disabled={loading}>
            {loading ? 'Creating...' : 'Create group'}
          </button>
        </div>
      </div>
    </div>
  );
}

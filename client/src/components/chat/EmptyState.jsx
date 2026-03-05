import './EmptyState.css';

export default function EmptyState() {
  return (
    <div className="empty-state">
      <div className="empty-icon">💬</div>
      <h2>Select a conversation</h2>
      <p>Choose a chat from the sidebar or search for someone to start messaging.</p>
    </div>
  );
}

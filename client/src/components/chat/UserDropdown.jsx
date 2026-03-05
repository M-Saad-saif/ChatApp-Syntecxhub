import { useEffect, useRef } from "react";
import "./UserDropdown.css";

export default function UserDropdown({ user, onLogout, onClose }) {
  const ref = useRef(null);

  useEffect(() => {
    const handler = (e) => {
      if (ref.current && !ref.current.contains(e.target)) onClose();
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [onClose]);

  return (
    <div className="user-dropdown" ref={ref}>
      <div className="user-dropdown-info">
        <div className="user-dropdown-name">{user?.username}</div>
        <div className="user-dropdown-email">{user?.email}</div>
      </div>
      <hr className="user-dropdown-divider" />
      <button className="user-dropdown-item danger" onClick={onLogout}>
        Sign out
      </button>
    </div>
  );
}

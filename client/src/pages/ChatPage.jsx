import { useState, useEffect } from "react";
import { useChat } from "../context/ChatContext";
import { useAuth } from "../context/AuthContext";
import Sidebar from "../components/chat/Sidebar";
import ChatWindow from "../components/chat/ChatWindow";
import EmptyState from "../components/chat/EmptyState";
import "./ChatPage.css";

export default function ChatPage() {
  const { activeChat } = useChat();
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    document.documentElement.setAttribute(
      "data-theme",
      darkMode ? "dark" : "light",
    );
  }, [darkMode]);

  return (
    <div className="chat-layout">
      <Sidebar
        darkMode={darkMode}
        onToggleDark={() => setDarkMode((d) => !d)}
      />
      <main className="chat-main">
        {activeChat ? <ChatWindow /> : <EmptyState />}
      </main>
    </div>
  );
}

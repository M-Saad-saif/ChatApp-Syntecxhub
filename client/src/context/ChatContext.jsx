import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from "react";
import { getSocket } from "../utils/socket";
import { useAuth } from "./AuthContext";
import api from "../utils/api";

const ChatContext = createContext(null);

export const ChatProvider = ({ children }) => {
  const { user } = useAuth();

  const [conversations, setConversations] = useState([]);
  const [groups, setGroups] = useState([]);
  const [activeChat, setActiveChat] = useState(null); // { type: 'dm'|'group', data: {...} }
  const [messages, setMessages] = useState([]);
  const [onlineUsers, setOnlineUsers] = useState([]);
  const [typingUsers, setTypingUsers] = useState({}); // { conversationId/groupId: [userId, ...] }
  const [loadingMessages, setLoadingMessages] = useState(false);

  // Load conversations and groups
  const loadConversations = useCallback(async () => {
    const [convRes, grpRes] = await Promise.all([
      api.get("/conversations"),
      api.get("/groups"),
    ]);
    setConversations(convRes.data.conversations);
    setGroups(grpRes.data.groups);
  }, []);

  useEffect(() => {
    if (user) loadConversations();
  }, [user, loadConversations]);

  // Socket event listeners
  useEffect(() => {
    if (!user) return;
    const socket = getSocket();
    if (!socket) return;

    const onUsersOnline = (ids) => setOnlineUsers(ids);

    const onNewMessage = ({ message, conversation }) => {
      // Append message if it belongs to active conversation
      setMessages((prev) => {
        if (
          activeChat?.type === "dm" &&
          activeChat.data._id === conversation._id
        ) {
          const exists = prev.find((m) => m._id === message._id);
          return exists ? prev : [...prev, message];
        }
        return prev;
      });
      // Update sidebar conversation
      setConversations((prev) => {
        const exists = prev.find((c) => c._id === conversation._id);
        if (exists) {
          return prev
            .map((c) => (c._id === conversation._id ? conversation : c))
            .sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt));
        }
        return [conversation, ...prev];
      });
    };

    const onGroupMessage = ({ message, groupId }) => {
      setMessages((prev) => {
        if (activeChat?.type === "group" && activeChat.data._id === groupId) {
          const exists = prev.find((m) => m._id === message._id);
          return exists ? prev : [...prev, message];
        }
        return prev;
      });
      setGroups((prev) =>
        prev
          .map((g) =>
            g._id === groupId
              ? { ...g, lastMessage: message, updatedAt: new Date() }
              : g,
          )
          .sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt)),
      );
    };

    const onTypingStart = ({ userId, conversationId, groupId }) => {
      const key = conversationId || groupId;
      setTypingUsers((prev) => ({
        ...prev,
        [key]: [...new Set([...(prev[key] || []), userId])],
      }));
    };

    const onTypingStop = ({ userId, conversationId, groupId }) => {
      const key = conversationId || groupId;
      setTypingUsers((prev) => ({
        ...prev,
        [key]: (prev[key] || []).filter((id) => id !== userId),
      }));
    };

    socket.on("users:online", onUsersOnline);
    socket.on("message:new", onNewMessage);
    socket.on("group:message:new", onGroupMessage);
    socket.on("typing:start", onTypingStart);
    socket.on("typing:stop", onTypingStop);

    return () => {
      socket.off("users:online", onUsersOnline);
      socket.off("message:new", onNewMessage);
      socket.off("group:message:new", onGroupMessage);
      socket.off("typing:start", onTypingStart);
      socket.off("typing:stop", onTypingStop);
    };
  }, [user, activeChat]);

  // Open a DM conversation
  const openDM = useCallback(async (targetUser) => {
    const { data } = await api.post("/conversations", {
      receiverId: targetUser._id,
    });
    setActiveChat({ type: "dm", data: data.conversation });
    setLoadingMessages(true);
    try {
      const msgRes = await api.get(
        `/messages/conversation/${data.conversation._id}`,
      );
      setMessages(msgRes.data.messages);
    } finally {
      setLoadingMessages(false);
    }
  }, []);

  // Open a group chat
  const openGroup = useCallback(async (group) => {
    setActiveChat({ type: "group", data: group });
    setLoadingMessages(true);
    try {
      const msgRes = await api.get(`/messages/group/${group._id}`);
      setMessages(msgRes.data.messages);
    } finally {
      setLoadingMessages(false);
    }
  }, []);

  // Send a direct message via socket
  const sendMessage = useCallback(
    (text) => {
      const socket = getSocket();
      if (!socket || !text.trim()) return;

      if (activeChat?.type === "dm") {
        const convo = activeChat.data;
        const receiver = convo.participants.find((p) => p._id !== user._id);
        socket.emit("message:send", {
          conversationId: convo._id,
          receiverId: receiver?._id,
          text,
        });
      } else if (activeChat?.type === "group") {
        socket.emit("group:message:send", {
          groupId: activeChat.data._id,
          text,
        });
      }
    },
    [activeChat, user],
  );

  return (
    <ChatContext.Provider
      value={{
        conversations,
        groups,
        activeChat,
        messages,
        onlineUsers,
        typingUsers,
        loadingMessages,
        loadConversations,
        openDM,
        openGroup,
        sendMessage,
        setConversations,
        setGroups,
      }}
    >
      {children}
    </ChatContext.Provider>
  );
};

export const useChat = () => useContext(ChatContext);

import { format, isToday, isYesterday, formatDistanceToNow } from "date-fns";

export const formatMessageTime = (date) => {
  return format(new Date(date), "HH:mm");
};

export const formatConversationTime = (date) => {
  if (!date) return "";
  const d = new Date(date);
  if (isToday(d)) return format(d, "HH:mm");
  if (isYesterday(d)) return "Yesterday";
  return format(d, "MMM d");
};

export const formatLastSeen = (date) => {
  if (!date) return "";
  return (
    "Last seen " + formatDistanceToNow(new Date(date), { addSuffix: true })
  );
};

export const getInitials = (name = "") => {
  return name
    .split(" ")
    .map((n) => n[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
};

// Generate a consistent bg color for a user from their name
export const getAvatarColor = (name = "") => {
  const colors = [
    "#2a5bd7",
    "#7c3aed",
    "#0891b2",
    "#059669",
    "#d97706",
    "#dc2626",
    "#db2777",
    "#7c3aed",
  ];
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  return colors[Math.abs(hash) % colors.length];
};

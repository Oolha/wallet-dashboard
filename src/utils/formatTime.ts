export  const formatTime = (timestamp: number) => {
  if (!timestamp) return "—";

  const now = Date.now() / 1000;
  const diff = now - timestamp;

  if (diff < 0) return "Just now";
  if (diff < 60) return "Just now";
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  if (diff < 604800) return `${Math.floor(diff / 86400)}d ago`;
  return new Date(timestamp * 1000).toLocaleDateString();
};
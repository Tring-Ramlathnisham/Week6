import { useState, useEffect } from "react";

const PersonaLastModified = ({ lastModified }) => {
  const [lastModifiedTime, setLastModifiedTime] = useState(null);

  useEffect(() => {
    if (lastModified) {
      const parsedDate = new Date(lastModified);
      if (!isNaN(parsedDate.getTime())) {
        setLastModifiedTime(parsedDate);
      }
    }
  }, [lastModified]);

  const getLastModifiedTime = () => {
    if (!lastModifiedTime) return "Never modified";

    const now = new Date();
    const diff = now.getTime() - lastModifiedTime.getTime();

    if (diff < 60 * 1000) return "Just now";
    const minutes = Math.floor(diff / (1000 * 60));
    if (minutes < 60) return `${minutes} minutes ago`;
    const hours = Math.floor(diff / (1000 * 60 * 60));
    if (hours < 24) return `${hours} hours ago`;
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    if (days < 31) return `${days} days ago`;
    const months = Math.floor(diff / (1000 * 60 * 60 * 24 * 30));
    return `${months} months ago`;
  };

  return <span>{getLastModifiedTime()}</span>;
};

export default PersonaLastModified;

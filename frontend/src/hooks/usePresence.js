/** @format */

import { useEffect, useState, useContext, useRef } from "react";
import { WebsocketContext } from "../contexts/WebsocketContext";

export const usePresence = (roomId, user, cursorPosition) => {
  const { socket } = useContext(WebsocketContext);
  const [users, setUsers] = useState([]);
  const lastSentCursor = useRef(null);
  const throttleTimeout = useRef(null);

  useEffect(() => {
    if (!socket || !roomId || !user) return;

    const handlePresenceUpdate = (presence) => {
      setUsers(presence);
    };

    const handleCursorUpdate = (cursors) => {
      setUsers((prevUsers) => {
        // Update users array with cursor positions from cursors array
        const updated = prevUsers.map((u) => {
          const c = cursors.find((cu) => cu.user.id === u.id);
          return c ? { ...u, cursor: c.cursor } : u;
        });
        return updated;
      });
    };

    socket.on("presence_update", handlePresenceUpdate);
    socket.on("cursor_update", handleCursorUpdate);

    return () => {
      socket.off("presence_update", handlePresenceUpdate);
      socket.off("cursor_update", handleCursorUpdate);
    };
  }, [socket, roomId, user]);

  // Throttle cursor updates to 100ms
  useEffect(() => {
    if (!cursorPosition || !socket || !roomId) return;

    if (lastSentCursor.current === cursorPosition) return;

    if (throttleTimeout.current) return;

    lastSentCursor.current = cursorPosition;

    socket.emit("cursor_update", { roomId, cursor: cursorPosition });

    throttleTimeout.current = setTimeout(() => {
      throttleTimeout.current = null;
    }, 100);
  }, [cursorPosition, socket, roomId]);

  return users;
};

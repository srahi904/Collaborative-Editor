/** @format */

import { useEffect, useState, useRef, useContext, useCallback } from "react";
import * as Y from "yjs";
import { WebsocketContext } from "../contexts/WebsocketContext";

export const useDocument = (roomId, user, initialContent = "") => {
  const { socket } = useContext(WebsocketContext);
  const ydocRef = useRef(null);
  const yTextRef = useRef(null);
  const [text, setText] = useState("");

  useEffect(() => {
    if (!socket || !roomId || !user) return;

    const ydoc = new Y.Doc();
    ydocRef.current = ydoc;
    const yText = ydoc.getText("document");
    yTextRef.current = yText;

    // Set initial content only if yText is empty
    if (yText.toString().length === 0 && initialContent.length > 0) {
      yText.insert(0, initialContent);
    }

    // Listen to Yjs text changes and update state
    yText.observe(() => {
      setText(yText.toString());
    });

    // Broadcast local changes
    const updateHandler = () => {
      const update = Y.encodeStateAsUpdate(ydoc);
      socket.emit("doc_update", { roomId, update });
    };
    yText.observe(updateHandler);

    // Listen for remote updates
    const onRemoteUpdate = (update) => {
      Y.applyUpdate(ydoc, new Uint8Array(update));
    };
    socket.on("doc_update", onRemoteUpdate);

    socket.emit("join_room", { roomId, user });

    return () => {
      socket.emit("leave_room", { roomId });
      socket.off("doc_update", onRemoteUpdate);
      ydoc.destroy();
    };
  }, [socket, roomId, user]);

  const updateText = useCallback((newText) => {
    if (!yTextRef.current) return;
    yTextRef.current.delete(0, yTextRef.current.length);
    yTextRef.current.insert(0, newText);
  }, []);

  // Get current Yjs text content (used for saving)
  const getCurrentText = useCallback(() => {
    return yTextRef.current ? yTextRef.current.toString() : "";
  }, []);

  return { text, updateText, ydocRef, getCurrentText };
};

/** @format */

import { useEffect, useState, useRef, useContext } from "react";
import * as Y from "yjs";
import { WebsocketContext } from "../contexts/WebsocketContext";

export const useDocument = (roomId, user, initialContent = "") => {
  const { socket } = useContext(WebsocketContext);
  const ydocRef = useRef(null);
  const [text, setText] = useState("");

  useEffect(() => {
    if (!socket || !roomId || !user) return;

    const ydoc = new Y.Doc();
    ydocRef.current = ydoc;

    const yText = ydoc.getText("document");

    // Set initial content if any
    if (initialContent) {
      yText.delete(0, yText.length);
      yText.insert(0, initialContent);
    }

    // Listen for local changes and update text state
    yText.observe(() => {
      setText(yText.toString());
    });

    // Listen to local changes to broadcast update
    yText.observe((event) => {
      const update = Y.encodeStateAsUpdate(ydoc);
      socket.emit("doc_update", { roomId, update });
    });

    // Listen for remote updates
    const onRemoteUpdate = (update) => {
      Y.applyUpdate(ydoc, new Uint8Array(update));
    };

    socket.on("doc_update", onRemoteUpdate);

    // Join room
    socket.emit("join_room", { roomId, user });

    // Cleanup on unmount
    return () => {
      socket.emit("leave_room", { roomId });
      socket.off("doc_update", onRemoteUpdate);
      ydoc.destroy();
    };
  }, [socket, roomId, user]);

  // Method to apply text updates locally
  const updateText = (newText) => {
    if (!ydocRef.current) return;
    const yText = ydocRef.current.getText("document");
    yText.delete(0, yText.length);
    yText.insert(0, newText);
  };

  return { text, updateText, ydocRef };
};

/** @format */

import React, { useContext, useState, useRef, useEffect } from "react";
import ContributorsSidebar from "./ContributorsSidebar";
import ChatBox from "./ChatBox";
import { useDocument } from "../../hooks/useDocument";
import { usePresence } from "../../hooks/usePresence";
import { useChat } from "../../hooks/useChat";
import { WebsocketContext } from "../../contexts/WebsocketContext";

const EditorLayout = ({
  roomId,
  user,
  onLeaveRoom,
  initialContent,
  onSaveContent,
}) => {
  const [cursorPos, setCursorPos] = React.useState(null);
  const { text, updateText, ydocRef } = useDocument(
    roomId,
    user,
    initialContent
  );

  const users = usePresence(roomId, user, cursorPos);
  const { messages, sendMessage } = useChat(roomId);
  const editorRef = useRef();

  const onCursorChange = () => {
    if (!editorRef.current) return;
    setCursorPos({
      start: editorRef.current.selectionStart,
      end: editorRef.current.selectionEnd,
    });
  };

  useEffect(() => {
    if (!onSaveContent) return;
    const interval = setInterval(() => {
      onSaveContent(text);
    }, 5000); // save every 5 seconds
    return () => clearInterval(interval);
  }, [text, onSaveContent]);

  useEffect(() => {
    if (!initialContent) return;
    if (!ydocRef.current) return;
    const yText = ydocRef.current.getText("document");
    if (yText.toString() !== initialContent) updateText(initialContent);
  }, [initialContent, ydocRef, updateText]);

  return (
    <div className="flex h-screen">
      <ContributorsSidebar
        users={users}
        onLeave={onLeaveRoom}
        roomId={roomId}
      />
      <main className="flex-grow flex flex-col p-4">
        <textarea
          ref={editorRef}
          className="flex-grow border p-2 resize-none"
          value={text}
          onChange={(e) => updateText(e.target.value)}
          onSelect={onCursorChange}
          spellCheck={false}
        />
      </main>
      <ChatBox messages={messages} sendMessage={sendMessage} />
    </div>
  );
};

export default EditorLayout;

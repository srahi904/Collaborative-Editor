/** @format */

import React, { useEffect, useState, useRef } from "react";
import { useDocument } from "../../hooks/useDocument";
import { usePresence } from "../../hooks/usePresence";
import { useChat } from "../../hooks/useChat";
import ContributorsSidebar from "./ContributorsSidebar";
import ChatBox from "./ChatBox";

/*
  NOTES:
  - Auto-save runs every 5 seconds ONLY IF 'onSaveContent' is provided as a prop.
    If you do not want auto-save, leave out the onSaveContent prop (or pass null/undefined).
  - You can add a Save button if you want manual saving.
*/

const EditorLayout = ({
  roomId,
  user,
  onLeaveRoom,
  initialContent,
  onSaveContent, // Provide this to enable auto-save
}) => {
  const [cursorPos, setCursorPos] = useState(null);
  const { text, updateText, getCurrentText } = useDocument(
    roomId,
    user,
    initialContent
  );
  const users = usePresence(roomId, user, cursorPos);
  const { messages, sendMessage } = useChat(roomId);
  const editorRef = useRef();

  // AUTO-SAVE: Save document content every 5 seconds, ONLY if onSaveContent is present
  useEffect(() => {
    if (typeof onSaveContent !== "function") {
      // Auto-save is NOT enabled if no save handler given
      return;
    }
    const saveInterval = setInterval(() => {
      const content = getCurrentText();
      onSaveContent(content);
    }, 5000);
    return () => clearInterval(saveInterval);
  }, [getCurrentText, onSaveContent]);

  const onCursorChange = () => {
    if (!editorRef.current) return;
    setCursorPos({
      start: editorRef.current.selectionStart,
      end: editorRef.current.selectionEnd,
    });
  };

  // Optional: Manual Save Button (useful if you want users to save manually instead)
  const handleManualSave = () => {
    if (typeof onSaveContent === "function") {
      const content = getCurrentText();
      onSaveContent(content);
    }
  };

  return (
    <div className="flex h-screen">
      <ContributorsSidebar
        users={users}
        onLeave={onLeaveRoom}
        roomId={roomId}
      />
      <main className="flex-grow flex flex-col p-4">
        {/* Optional: Show auto-save status */}
        {typeof onSaveContent === "function" && (
          <div className="mb-2 text-xs text-gray-500">
            Auto-save enabled (5s interval). For the Content, Please press the
            spacebar.
          </div>
        )}

        <textarea
          ref={editorRef}
          className="flex-grow border p-2 resize-none"
          value={text}
          onChange={(e) => updateText(e.target.value)}
          onSelect={onCursorChange}
          spellCheck={false}
        />

        {/* Uncomment this if you want manual save instead, or in addition to auto-save */}
        <button
          onClick={handleManualSave}
          className="my-2 bg-blue-600 text-white px-4 py-2 rounded"
        >
          Save
        </button>
      </main>
      <ChatBox messages={messages} sendMessage={sendMessage} />
    </div>
  );
};

export default EditorLayout;

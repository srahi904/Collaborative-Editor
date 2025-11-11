/** @format */

import React, { useState, useEffect, useRef } from "react";

const ChatBox = ({ messages, sendMessage }) => {
  const [input, setInput] = useState("");
  const messagesEndRef = useRef(null);
  const onSubmit = (e) => {
    e.preventDefault();
    if (!input.trim()) return;
    sendMessage(input);
    setInput("");
  };
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);
  return (
    <div className="flex flex-col h-full border-l p-2 w-80">
      <div className="flex-grow overflow-y-auto mb-2">
        {messages.map((msg, idx) => (
          <div key={idx} className="mb-1">
            <strong>{msg.username}: </strong>
            <span>{msg.text}</span>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>
      <form onSubmit={onSubmit} className="flex">
        <input
          className="flex-grow border rounded-l px-3 py-1"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type a message"
          spellCheck={false}
        />
        <button
          type="submit"
          className="bg-blue-600 text-white px-4 rounded-r hover:bg-blue-700"
        >
          Send
        </button>
      </form>
    </div>
  );
};
export default ChatBox;

/** @format */

import { useEffect, useState, useContext } from "react";
import { WebsocketContext } from "../contexts/WebsocketContext";

export const useChat = (roomId) => {
  const { socket } = useContext(WebsocketContext);
  const [messages, setMessages] = useState([]);
  useEffect(() => {
    if (!socket || !roomId) return;
    const handleNewMessage = (msg) => setMessages((prev) => [...prev, msg]);
    socket.on("chat_message", handleNewMessage);
    return () => socket.off("chat_message", handleNewMessage);
  }, [socket, roomId]);
  const sendMessage = (message) => {
    if (!socket || !roomId) return;
    socket.emit("chat_message", { roomId, message });
  };
  return { messages, sendMessage };
};

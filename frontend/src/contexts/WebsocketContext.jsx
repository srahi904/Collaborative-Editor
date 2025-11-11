/** @format */

import React, { createContext, useEffect, useState } from "react";
import { io } from "socket.io-client";
export const WebsocketContext = createContext();

export const WebsocketProvider = ({ children }) => {
  const [socket, setSocket] = useState(null);
  useEffect(() => {
    const s = io(import.meta.env.VITE_API_WS || "http://localhost:4000");
    setSocket(s);
    return () => s.disconnect();
  }, []);
  return (
    <WebsocketContext.Provider value={{ socket }}>
      {children}
    </WebsocketContext.Provider>
  );
};

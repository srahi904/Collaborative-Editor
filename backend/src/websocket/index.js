/** @format */

const { Server } = require("socket.io");

let io;

const rooms = {};

const initWebSocket = (server) => {
  io = new Server(server, {
    cors: { origin: "*" },
  });

  io.on("connection", (socket) => {
    socket.on("join_room", ({ roomId, user }) => {
      socket.join(roomId);
      if (!rooms[roomId]) rooms[roomId] = {};

      rooms[roomId][socket.id] = { user, cursor: null };

      io.to(roomId).emit(
        "presence_update",
        Object.values(rooms[roomId]).map((p) => p.user)
      );
    });

    socket.on("leave_room", ({ roomId }) => {
      socket.leave(roomId);
      if (rooms[roomId]) {
        delete rooms[roomId][socket.id];
        io.to(roomId).emit(
          "presence_update",
          Object.values(rooms[roomId]).map((p) => p.user)
        );
      }
    });

    socket.on("doc_update", ({ roomId, update }) => {
      socket.to(roomId).emit("doc_update", update);
    });

    socket.on("cursor_update", ({ roomId, cursor }) => {
      if (rooms[roomId] && rooms[roomId][socket.id]) {
        rooms[roomId][socket.id].cursor = cursor;
        const cursors = Object.values(rooms[roomId]).map((p) => ({
          user: p.user,
          cursor: p.cursor,
        }));
        socket.to(roomId).emit("cursor_update", cursors);
      }
    });

    socket.on("chat_message", ({ roomId, message }) => {
      const sender = rooms[roomId]?.[socket.id]?.user || {
        username: "Unknown",
      };
      const chatMsg = {
        username: sender.username,
        text: message,
        timestamp: new Date().toISOString(),
      };
      io.to(roomId).emit("chat_message", chatMsg);
    });

    socket.on("disconnecting", () => {
      const roomsJoined = Array.from(socket.rooms);
      roomsJoined.forEach((roomId) => {
        if (rooms[roomId]) {
          delete rooms[roomId][socket.id];
          io.to(roomId).emit(
            "presence_update",
            Object.values(rooms[roomId]).map((p) => p.user)
          );
        }
      });
    });
  });
};

module.exports = { initWebSocket };

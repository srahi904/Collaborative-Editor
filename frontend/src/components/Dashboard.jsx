/** @format */

import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import { AuthContext } from "../contexts/AuthContext";
import FolderTree from "./FolderTree";
import { WebsocketContext } from "../contexts/WebsocketContext";
import { useNavigate } from "react-router-dom";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:4000/api";

const Dashboard = () => {
  const { user, logout } = useContext(AuthContext);
  const { socket } = useContext(WebsocketContext);

  const [folderTree, setFolderTree] = useState([]);
  const [newFolderName, setNewFolderName] = useState("");
  const [selectedFolderId, setSelectedFolderId] = useState(null);
  const [newDocName, setNewDocName] = useState("");
  const [roomId, setRoomId] = useState("");
  const [joinedRoom, setJoinedRoom] = useState(null);
  const navigate = useNavigate();

  const authHeaders = {
    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
  };

  // Fetch folder tree for logged-in user
  const fetchFolderTree = async () => {
    try {
      const res = await axios.get(`${API_URL}/folders/tree`, authHeaders);
      setFolderTree(res.data);
    } catch (err) {
      alert("Failed to fetch folder tree");
    }
  };

  useEffect(() => {
    fetchFolderTree();
  }, []);

  // Join room by roomId, transition to collaborative files of that room
  const joinRoom = () => {
    if (!roomId.trim()) {
      alert("Please enter a valid Room ID");
      return;
    }
    navigate(`/editor/${roomId.trim()}`);
  };

  const leaveRoom = () => {
    if (!joinedRoom) return;
    socket.emit("leave_room", { roomId: joinedRoom });
    setJoinedRoom(null);
  };

  const createFolder = async () => {
    if (!newFolderName.trim()) return alert("Folder name cannot be empty");
    try {
      await axios.post(
        `${API_URL}/folders`,
        { name: newFolderName.trim(), parentFolder: selectedFolderId || null },
        authHeaders
      );
      setNewFolderName("");
      fetchFolderTree();
    } catch {
      alert("Failed to create folder");
    }
  };

  const createDoc = async () => {
    if (!newDocName.trim()) return alert("File name cannot be empty");
    if (!selectedFolderId) return alert("Select a folder first!");
    try {
      await axios.post(
        `${API_URL}/docs`,
        { name: newDocName.trim(), folder: selectedFolderId },
        authHeaders
      );
      setNewDocName("");
      fetchFolderTree();
    } catch {
      alert("Failed to create document");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="mb-6 flex items-center space-x-2 justify-center">
        <input
          className="border px-3 py-2 rounded w-[600px]"
          placeholder="Enter Room ID to join"
          value={roomId}
          onChange={(e) => setRoomId(e.target.value)}
        />
        <button
          onClick={joinRoom}
          className="bg-green-600 text-white px-4 rounded hover:bg-green-700 py-2"
        >
          Join Room
        </button>
        {joinedRoom && (
          <button
            onClick={leaveRoom}
            className="bg-red-600 text-white px-4 rounded hover:bg-red-700"
          >
            Leave Room
          </button>
        )}
      </div>

      <div className="flex gap-8">
        <div className="w-1/3 bg-white p-4 rounded shadow max-h-[600px] overflow-auto">
          <h2 className="font-bold mb-2">Folders & Files</h2>
          <FolderTree
            folders={folderTree}
            selectedFolderId={selectedFolderId}
            setSelectedFolderId={setSelectedFolderId}
          />
        </div>

        <div className="flex-1 bg-white p-4 rounded shadow">
          <h3 className="mb-2 font-semibold">Create New Folder</h3>
          <input
            type="text"
            placeholder="Folder name"
            value={newFolderName}
            onChange={(e) => setNewFolderName(e.target.value)}
            className="border px-3 py-2 rounded w-full mb-4"
          />
          <button
            onClick={createFolder}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            {selectedFolderId
              ? "Create Folder Inside Selected Folder"
              : "Create Root Folder"}
          </button>

          <h3 className="mt-6 mb-2 font-semibold">Create New File</h3>
          <input
            type="text"
            placeholder="File name"
            value={newDocName}
            onChange={(e) => setNewDocName(e.target.value)}
            className="border px-3 py-2 rounded w-full mb-4"
          />
          <button
            onClick={createDoc}
            disabled={!selectedFolderId}
            className={`bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 ${
              !selectedFolderId ? "opacity-50 cursor-not-allowed" : ""
            }`}
          >
            Create File In Selected Folder
          </button>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;

/** @format */

import React, { useContext, useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { AuthContext } from "../contexts/AuthContext";
import EditorLayout from "./Editor/EditorLayout";
import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:4000/api";

const EditorPage = () => {
  const { id } = useParams(); // document id or room id
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [initialContent, setInitialContent] = useState("");

  useEffect(() => {
    const fetchContent = async () => {
      try {
        const res = await axios.get(`${API_URL}/docs/${id}`, {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        });
        setInitialContent(res.data.content || "");
      } catch {
        alert("Failed to load document content");
      }
    };
    fetchContent();
  }, [id]);

  const saveContent = async (content) => {
    try {
      await axios.put(
        `${API_URL}/docs/${id}`,
        { content },
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      );
    } catch {
      alert("Failed to save document");
    }
  };

  return (
    <EditorLayout
      roomId={id}
      user={user}
      initialContent={initialContent}
      onLeaveRoom={() => navigate("/dashboard")}
      onSaveContent={saveContent}
    />
  );
};

export default EditorPage;

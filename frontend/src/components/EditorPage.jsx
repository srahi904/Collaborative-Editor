/** @format */

// EditorPage.jsx
import React, { useContext, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { AuthContext } from "../contexts/AuthContext";
import EditorLayout from "./Editor/EditorLayout";
import { fetchDocument, saveDocument } from "../api/docs";

const EditorPage = () => {
  const { id } = useParams();
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const initialLoaded = useRef(false);

  // This assumes your EditorLayout accepts callback to load/save
  const [initialContent, setInitialContent] = React.useState("");
  useEffect(() => {
    const loadContent = async () => {
      try {
        const res = await fetchDocument(id, localStorage.getItem("token"));
        setInitialContent(res.data.content || "");
      } catch {
        alert("Failed to load document");
      }
    };
    loadContent();
  }, [id]);

  // Save every 5 seconds
  const handleSave = async (content) => {
    try {
      await saveDocument(id, content, localStorage.getItem("token"));
    } catch (err) {
      alert("Failed to save document");
    }
  };

  return (
    <EditorLayout
      roomId={id}
      user={user}
      onLeaveRoom={() => navigate("/dashboard")}
      initialContent={initialContent}
      onSaveContent={handleSave}
    />
  );
};

export default EditorPage;

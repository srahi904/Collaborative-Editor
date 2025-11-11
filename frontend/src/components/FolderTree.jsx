/** @format */

import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const FolderTree = ({ folders, selectedFolderId, setSelectedFolderId }) => (
  <div>
    {folders.map((folder) => (
      <FolderNode
        key={folder._id}
        node={folder}
        level={0}
        selectedFolderId={selectedFolderId}
        setSelectedFolderId={setSelectedFolderId}
      />
    ))}
  </div>
);

const FolderNode = ({ node, level, selectedFolderId, setSelectedFolderId }) => {
  const [expanded, setExpanded] = useState(false);
  const navigate = useNavigate();

  const isSelected = selectedFolderId === node._id;

  return (
    <div style={{ paddingLeft: level * 20 }} className="mb-1">
      <div
        className={`cursor-pointer font-semibold flex items-center ${
          isSelected ? "bg-blue-100 rounded" : ""
        }`}
        onClick={() => setSelectedFolderId(node._id)}
      >
        <span
          onClick={(e) => {
            e.stopPropagation();
            setExpanded(!expanded);
          }}
        >
          {expanded ? "📂" : "📁"}
        </span>
        <span className="ml-1">{node.name}</span>
        {isSelected && (
          <span className="ml-2 text-xs text-blue-600">(selected)</span>
        )}
      </div>
      {expanded && (
        <div className="ml-4">
          {node.children.map((child) => (
            <FolderNode
              key={child._id}
              node={child}
              level={level + 1}
              selectedFolderId={selectedFolderId}
              setSelectedFolderId={setSelectedFolderId}
            />
          ))}
          {node.files.map((file) => (
            <div
              key={file._id}
              className="cursor-pointer text-blue-600 hover:underline"
              style={{ paddingLeft: 20 }}
              onClick={() => navigate(`/editor/${file._id}`)}
            >
              📄 {file.name}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default FolderTree;

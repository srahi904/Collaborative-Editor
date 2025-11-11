/** @format */

// src/models/Folder.js
const mongoose = require("mongoose");

const FolderSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    owner: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    parentFolder: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Folder",
      default: null,
    }, // For nesting
  },
  { timestamps: true }
);

module.exports = mongoose.model("Folder", FolderSchema);

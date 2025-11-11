/** @format */

const mongoose = require("mongoose");

const DocumentSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    owner: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    folder: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Folder",
      default: null,
    },
    content: { type: String, default: "" }, // Add this field
  },
  { timestamps: true }
);

module.exports = mongoose.model("Document", DocumentSchema);

/** @format */

const Document = require("../models/Document");

exports.getDocuments = async (req, res) => {
  try {
    const docs = await Document.find({ owner: req.user._id });
    res.json(docs);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

exports.createDocument = async (req, res) => {
  const { name, folder } = req.body;
  try {
    const doc = new Document({
      name,
      owner: req.user._id,
      folder: folder || null,
    });
    await doc.save();
    res.status(201).json(doc);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

// Load full document (for opening in editor)

exports.getDocumentById = async (req, res) => {
  try {
    const doc = await Document.findById(req.params.id);
    if (!doc) return res.status(404).json({ message: "Document not found" });
    res.json(doc);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch document" });
  }
};

// Save document content (on collaborative edit)
exports.saveDocumentContent = async (req, res) => {
  const docId = req.params.id;
  const { content } = req.body;

  if (typeof content !== "string") {
    return res.status(400).json({ message: "Content must be a string" });
  }

  try {
    const doc = await Document.findById(docId);
    if (!doc) {
      return res.status(404).json({ message: "Document not found" });
    }
    doc.content = content;
    await doc.save();

    res.json({ message: "Document saved successfully", content: doc.content });
  } catch (err) {
    console.error("Error saving document content:", err);
    res.status(500).json({ message: "Failed to save document content" });
  }
};

// Delete document
exports.deleteDocument = async (req, res) => {
  try {
    const doc = await Document.findById(req.params.id);
    if (!doc) return res.status(404).json({ message: "Document not found" });
    await doc.remove();
    res.json({ message: "Document deleted" });
  } catch (err) {
    res.status(500).json({ message: "Failed to delete document" });
  }
};

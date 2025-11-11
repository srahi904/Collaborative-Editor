/** @format */

// src/controllers/folderController.js example for fetching folder tree
const Folder = require("../models/Folder");
const Document = require("../models/Document");

exports.getFolderTree = async (req, res) => {
  try {
    const folders = await Folder.find({ owner: req.user._id });
    const docs = await Document.find({ owner: req.user._id });

    // Build tree structure
    const folderMap = {};
    folders.forEach(
      (f) => (folderMap[f._id] = { ...f._doc, children: [], files: [] })
    );

    // Assign folders to parents
    folders.forEach((f) => {
      if (f.parentFolder) {
        folderMap[f.parentFolder.toString()]?.children.push(folderMap[f._id]);
      }
    });

    // Assign files to folders
    docs.forEach((d) => {
      if (d.folder) {
        folderMap[d.folder.toString()]?.files.push(d);
      }
    });

    // Root folders (no parent)
    const rootFolders = Object.values(folderMap).filter((f) => !f.parentFolder);

    res.json(rootFolders);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch folder tree" });
  }
};

exports.createFolder = async (req, res) => {
  const { name, parentFolder } = req.body;

  if (!name || name.trim() === "") {
    return res.status(400).json({ message: "Folder name is required" });
  }

  try {
    const folder = new Folder({
      name: name.trim(),
      owner: req.user._id,
      parentFolder: parentFolder || null,
    });

    await folder.save();

    res.status(201).json(folder);
  } catch (err) {
    console.error("Failed to create folder:", err);
    res.status(500).json({ message: "Failed to create folder" });
  }
};

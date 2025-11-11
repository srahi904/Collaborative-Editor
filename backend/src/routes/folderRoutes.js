/** @format */

const express = require("express");
const router = express.Router();
const protect = require("../middlewares/auth");
const {
  getFolderTree,
  createFolder,
} = require("../controllers/folderController");

router.use(protect);

router.get("/tree", getFolderTree);
router.post("/", createFolder);

module.exports = router;

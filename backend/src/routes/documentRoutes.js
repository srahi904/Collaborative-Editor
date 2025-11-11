/** @format */

const express = require("express");
const router = express.Router();
const protect = require("../middlewares/auth");
const {
  createDocument,
  getDocuments,
  getDocumentById,
  saveDocumentContent,
} = require("../controllers/documentController");

router.use(protect);

router.post("/", createDocument);
router.get("/", getDocuments);

router.get("/:id", getDocumentById);
router.put("/:id", saveDocumentContent); // save endpoint

module.exports = router;

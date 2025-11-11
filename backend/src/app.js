/** @format */

const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");
require("dotenv").config();

const authRoutes = require("./routes/authRoutes");
const folderRoutes = require("./routes/folderRoutes");
const documentRoutes = require("./routes/documentRoutes");

const app = express();
connectDB();

app.use(cors());
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/folders", folderRoutes);
app.use("/api/docs", documentRoutes);

app.get("/", (req, res) => res.send("API Running"));

module.exports = app;

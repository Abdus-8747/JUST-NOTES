require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const cors = require("cors");
const rateLimit = require("express-rate-limit");

const User = require("./models/user.model");
const Note = require("./models/note.model");
const { authenticateToken } = require("./utils");

const app = express();

// ✅ Global Rate Limiter: 20 requests per 15 minutes
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 20, // limit each IP to 20 requests per windowMs
  message: {
    error: true,
    message: "Too many requests. Please try again in 15 minutes.",
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// Middleware
app.use(cors({ origin: "*" }));
app.use(express.json());
app.use(apiLimiter); // ⛔ Apply rate limiting globally

// MongoDB Connection
mongoose.connect(process.env.MONGO_URL);

// Home Route
app.get("/", (req, res) => {
  res.json({ data: "hello from server again" });
});

// Create Account
app.post("/create-account", async (req, res) => {
  const { fullName, email, password } = req.body;

  if (!fullName || !email || !password) {
    return res.status(400).json({ error: true, message: "All fields are required" });
  }

  const isUser = await User.findOne({ email });
  if (isUser) return res.json({ error: true, message: "User already exists" });

  const hashedPassword = await bcrypt.hash(password, 10);

  const user = new User({ fullName, email, password: hashedPassword });
  await user.save();

  const accessToken = jwt.sign({ user }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: "3000m" });

  res.json({ error: false, user, accessToken, message: "User Created Successfully" });
});

// Login
app.post("/login", async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password)
    return res.status(400).json({ error: true, message: "All fields are required" });

  const userInfo = await User.findOne({ email });
  if (!userInfo) return res.status(400).json({ error: true, message: "User Not Exist" });

  const isPasswordCorrect = await bcrypt.compare(password, userInfo.password);
  if (!isPasswordCorrect) return res.status(400).json({ error: true, message: "Invalid Credentials" });

  const user = { user: userInfo };
  const accessToken = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, { expiresIn: "3000m" });

  res.json({ error: false, user, accessToken, message: "User Logged In Successfully" });
});

// Get User
app.get("/get-user", authenticateToken, async (req, res) => {
  const { user } = req.user;
  const isUser = await User.findById(user._id);

  if (!isUser) return res.status(401).json({ error: true, message: "Unauthorized" });

  res.json({
    user: {
      fullName: isUser.fullName,
      email: isUser.email,
      _id: isUser._id,
      createdOn: isUser.createdOn,
    },
    message: "Got User",
  });
});

// Add Note
app.post("/add-note", authenticateToken, async (req, res) => {
  const { title, content, tags } = req.body;
  const { user } = req.user;

  if (!title || !content)
    return res.status(400).json({ error: true, message: "Title and Content required" });

  try {
    const note = new Note({ title, content, tags: tags || [], userId: user._id });
    await note.save();
    res.json({ error: false, note, message: "Note Added Successfully" });
  } catch (error) {
    console.error("Error adding note:", error);
    res.status(500).json({ error: true, message: "Internal Server Error" });
  }
});

// Edit Note
app.put("/edit-note/:noteId", authenticateToken, async (req, res) => {
  const noteId = req.params.noteId;
  const { title, content, tags, isPinned } = req.body;
  const { user } = req.user;

  if (!title && !content && !tags)
    return res.status(400).json({ error: true, message: "No Changes Provided" });

  try {
    const note = await Note.findOne({ _id: noteId, userId: user._id });
    if (!note) return res.status(400).json({ error: true, message: "Note not found" });

    if (title) note.title = title;
    if (content) note.content = content;
    if (tags) note.tags = tags;
    if (isPinned !== undefined) note.isPinned = isPinned;

    await note.save();
    res.json({ error: false, note, message: "Note Updated Successfully" });
  } catch (error) {
    console.error("Error updating note:", error);
    res.status(500).json({ error: true, message: "Internal Server Error" });
  }
});

// Get All Notes
app.get("/get-all-notes", authenticateToken, async (req, res) => {
  const { user } = req.user;

  try {
    const notes = await Note.find({ userId: user._id }).sort({ isPinned: -1 });
    res.json({ error: false, notes, message: "All Notes Retrieved Successfully" });
  } catch (error) {
    console.error("Error retrieving notes:", error);
    res.status(500).json({ error: true, message: "Internal Server Error" });
  }
});

// Delete Note
app.delete("/delete-note/:noteId", authenticateToken, async (req, res) => {
  const noteId = req.params.noteId;
  const { user } = req.user;

  try {
    const note = await Note.findOne({ _id: noteId, userId: user._id });
    if (!note) return res.status(400).json({ error: true, message: "Note not found" });

    await Note.deleteOne({ _id: noteId, userId: user._id });
    res.json({ error: false, message: "Note Deleted Successfully" });
  } catch (error) {
    console.error("Error deleting note:", error);
    res.status(500).json({ error: true, message: "Internal Server Error" });
  }
});

// Update Pin Status
app.put("/update-note-pined/:noteId", authenticateToken, async (req, res) => {
  const noteId = req.params.noteId;
  const { isPinned } = req.body;
  const { user } = req.user;

  try {
    const note = await Note.findOne({ _id: noteId, userId: user._id });
    if (!note) return res.status(400).json({ error: true, message: "Note not found" });

    note.isPinned = isPinned || false;
    await note.save();
    res.json({ error: false, note, message: "Note Updated Successfully" });
  } catch (error) {
    console.error("Error updating pin:", error);
    res.status(500).json({ error: true, message: "Internal Server Error" });
  }
});

// Search Notes
app.get("/search-notes", authenticateToken, async (req, res) => {
  const { query } = req.query;
  const { user } = req.user;

  if (!query) return res.status(400).json({ error: true, message: "Search Query is required" });

  try {
    const matchingNotes = await Note.find({
      userId: user._id,
      $or: [
        { title: { $regex: new RegExp(query, "i") } },
        { content: { $regex: new RegExp(query, "i") } },
      ],
    });

    res.json({ error: false, notes: matchingNotes, message: "Matched Notes Retrieved" });
  } catch (error) {
    console.error("Error searching notes:", error);
    res.status(500).json({ error: true, message: "Internal Server Error" });
  }
});

// Server
app.listen(8000, () => {
  console.log("Server running on port 8000");
});

module.exports = app;

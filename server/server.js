require("dotenv").config();
const express = require("express");
const cors = require("cors");
const connectDB = require("./db");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("./models/User");
const Todo = require("./models/Todo");
const auth = require("./middleware/auth");

const app = express();
const PORT = process.env.PORT || 4000;
const JWT_SECRET = process.env.JWT_SECRET;
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN;

app.use(cors());
app.use(express.json());

app.get("/api/test", (req, res) => {
    res.json("chal rha hai");
});

// Signup
app.post("/api/signup", async (req, res) => {
  try {
    const { name, email, password } = req.body || {};
    if (!name || !email || !password) return res.status(400).json({ message: "name, email, password required" });

    const existing = await User.findOne({ email: email.toLowerCase() });
    if (existing) return res.status(409).json({ message: "Email already registered" });

    const hashed = await bcrypt.hash(password, 10);
    const user = new User({ name, email: email.toLowerCase(), password: hashed });
    await user.save();

    const token = jwt.sign({ id: user._id, email: user.email, name: user.name }, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
    res.json({ token, user: { id: user._id, name: user.name, email: user.email } });
  } catch (err) {
    console.error("signup error", err);
    res.status(500).json({ message: "server error" });
  }
});


//Login
app.post("/api/login", async (req, res) => {
  try {
    const { email, password } = req.body || {};
    if (!email || !password) return res.status(400).json({ message: "email and password required" });

    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) return res.status(401).json({ message: "Invalid credentials" });

    const ok = await bcrypt.compare(password, user.password);
    if (!ok) return res.status(401).json({ message: "Invalid credentials" });

    const token = jwt.sign({ id: user._id, email: user.email, name: user.name }, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
    res.json({ token, user: { id: user._id, name: user.name, email: user.email } });
  } catch (err) {
    console.error("login error", err);
    res.status(500).json({ message: "server error" });
  }
});

// get user todos
app.get("/api/todos", auth, async (req, res) => {
  try {
    const todos = await Todo.find({ userId: req.user.id }).sort({ createdAt: 1 }).select("_id task isDone createdAt");
    res.json({ todos });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "server error" });
  }
});

// create todo
app.post("/api/todos", auth, async (req, res) => {
  try {
    const { task } = req.body || {};
    if (!task || !task.trim()) return res.status(400).json({ message: "task required" });

    const todo = new Todo({ userId: req.user.id, task: task.trim() });
    await todo.save();
    res.status(201).json({ id: todo._id, task: todo.task, isDone: todo.isDone });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "server error" });
  }
});

// update todos
app.put("/api/todos/:id", auth, async (req, res) => {
  try {
    const { id } = req.params;
    const { task, isDone } = req.body || {};
    const update = {};
    if (task !== undefined) update.task = task;
    if (isDone !== undefined) update.isDone = isDone;

    const todo = await Todo.findOneAndUpdate({ _id: id, userId: req.user.id }, { $set: update }, { new: true });
    if (!todo) return res.status(404).json({ message: "Not found" });
    res.json({ id: todo._id, task: todo.task, isDone: todo.isDone });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "server error" });
  }
});

//delete todo
app.delete("/api/todos/:id", auth, async (req, res) => {
  try {
    const { id } = req.params;
    const result = await Todo.findOneAndDelete({ _id: id, userId: req.user.id });
    if (!result) return res.status(404).json({ message: "Not found" });
    res.json({ message: "deleted" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "server error" });
  }
});

connectDB().then(() => {
    app.listen(PORT, () => {
        console.log(`Server running on http://localhost:${PORT}`);
    });
});

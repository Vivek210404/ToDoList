require("dotenv").config();
const express = require("express");
const cors = require("cors");

const app = express();
const PORT = process.env.PORT || 4000;

app.use(cors());
app.use(express.json());

app.get("/api/test", (req, res) => {
  res.json("chal rha hai");
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

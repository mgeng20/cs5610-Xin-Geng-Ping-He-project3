require("dotenv").config();
const express = require("express");
const path = require("path");
const mongoose = require("mongoose");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const authRoutes = require("./routes/auth.routes");
const passwordRoutes = require("./routes/password.routes");
const accountRoutes = require("./routes/account.routes");

const app = express();
const mongoDBEndpoint = process.env.MONGO_URI;
const PORT = process.env.PORT || 3000;

console.log("mongoDBEndpoint", mongoDBEndpoint);

// MongoDB connection
mongoose
  .connect(mongoDBEndpoint, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("MongoDB connected successfully."))
  .catch((err) => console.error("MongoDB connection error:", err));

// Middlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/passwords", passwordRoutes);
app.use("/api/account", accountRoutes);

// Serve static files from the React frontend app
const buildPath = path.join(__dirname, "..", "frontend", "build");
app.use(express.static(buildPath));
app.get("*", (req, res) => {
  res.sendFile(path.resolve(buildPath, "index.html"));
});

// Start server
console.log(`Attempting to listen on http://localhost:${PORT}`);
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

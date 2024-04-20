const express = require("express");
// const pokemon = require('./apis/pokemon')
// const users = require('./apis/user')
const app = express();
const mongoose = require("mongoose");
const cors = require("cors");
const path = require("path");
const cookieParser = require("cookie-parser");

const mongoDBEndpoint =
  "mongodb+srv://xingeng:VP2QDrXDOsoWdqgk@5610project3.ibdkthz.mongodb.net/?retryWrites=true&w=majority&appName=5610project3";
mongoose.connect(mongoDBEndpoint, { useNewUrlParser: true });

const db = mongoose.connection;
db.on("error", console.error.bind(console, "Err or connecting to MongoDB:"));

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// app.use("/api/pokemon/", pokemon);
// app.use("/api/users/", users);

let frontend_dir = path.join(__dirname, "..", "frontend", "dist");

app.use(express.static(frontend_dir));
app.get("*", function (req, res) {
  console.log("received request");
  res.sendFile(path.join(frontend_dir, "index.html"));
});

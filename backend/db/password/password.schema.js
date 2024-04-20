const mongoose = require("mongoose");

const PasswordSchema = new mongoose.Schema(
  {
    service: {
      type: String,
      unique: true,
    },
    password: {
      type: String,
      require: true,
    },
    lastUpdated: {
      type: Date,
      required: true,
    },
  },
  { collection: "pswdData" }
);

exports.PasswordSchema = PasswordSchema;
exports.Password = mongoose.model("Password", PasswordSchema);

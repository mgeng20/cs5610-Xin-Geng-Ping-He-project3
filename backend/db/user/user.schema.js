const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      unique: true,
    },
    password: {
      type: String,
      require: true,
    },
  },
  { collection: "usersPswdMng" }
);

exports.UserSchema = UserSchema;
exports.User = mongoose.model("User", UserSchema);

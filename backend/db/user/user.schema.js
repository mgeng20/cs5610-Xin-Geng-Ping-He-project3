const Schema = require("mongoose").Schema;

exports.UserSchema = new Schema(
  {
    username: {
      type: String,
      unique: true,
    },
    email: {
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

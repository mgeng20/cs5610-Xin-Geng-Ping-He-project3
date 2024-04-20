const Schema = require("mongoose").Schema;

exports.PasswordSchema = new Schema(
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

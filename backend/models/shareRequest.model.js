const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const ShareRequestSchema = new Schema(
  {
    sender: {
      type: Schema.Types.ObjectId,
      ref: "UserModel",
    },
    recipient: {
      type: Schema.Types.ObjectId,
      ref: "UserModel",
    },

    password: {
      type: Schema.Types.ObjectId,
      ref: "PasswordModel",
    },
  },

  {
    collection: "Share requests",
  }
);
const ShareRequestModel = mongoose.model(
  "ShareRequestModel",
  ShareRequestSchema
);
module.exports = ShareRequestModel;

const mongoose = require("mongoose");

const PasswordSchema = require("./password.schema").PasswordSchema;

const PasswordModel = mongoose.model("PasswordModel", PasswordSchema);

function createPassword(password) {
  return PasswordModel.create(password);
}

function getAllPassword() {
  return PasswordModel.find().exec();
}

module.exports = {
  createPassword,
  getAllPassword,
};

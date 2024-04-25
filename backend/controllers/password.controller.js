const PasswordModel = require("../models/password.model");

exports.getAllPasswords = async (req, res) => {
  const { userId } = req.user;
  const { keyword } = req.query;
  try {
    const query = { user: userId };
    if (keyword) {
      query["service"] = {
        $regex: keyword,
      };
    }
    const passwords = await PasswordModel.find(query);
    res.json(passwords);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error retrieving passwords", error: error.message });
  }
};

exports.createPassword = async (req, res) => {
  const { userId } = req.user;
  try {
    const { service, password } = req.body;
    const existingService = await PasswordModel.findOne({ service });
    if (existingService) {
      res
        .status(400)
        .json({ message: "This service already has a password saved." });
      return;
    }
    const newPassword = await PasswordModel.create({
      service,
      password,
      user: userId,
      lastUpdated: new Date(),
    });
    res.status(201).json(newPassword);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error creating password", error: error.message });
  }
};

exports.updatePassword = async (req, res) => {
  try {
    const { password } = req.body;
    const updatedPassword = await PasswordModel.findByIdAndUpdate(
      req.params.id,
      { password },
      { new: true }
    );
    res.json(updatedPassword);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error updating password", error: error.message });
  }
};

exports.deletePassword = async (req, res) => {
  try {
    await PasswordModel.findByIdAndDelete(req.params.id);
    res.json({ message: "Password deleted successfully" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error deleting password", error: error.message });
  }
};

exports.sharePassword = async (req, res) => {
  try {
    const { sharedWith, passwordId } = req.body; // Assuming you pass userId to share with and passwordId
    const password = await PasswordModel.findById(passwordId);
    if (!password) {
      return res.status(404).json({ message: "Password not found" });
    }
    password.sharedWith = sharedWith; // Update the password model accordingly
    await password.save();
    res.json({ message: "Password shared successfully" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error sharing password", error: error.message });
  }
};

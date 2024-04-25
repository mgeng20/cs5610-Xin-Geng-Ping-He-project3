const express = require("express");
const { verifyToken } = require("../middleware/authMiddleware");
const UserModel = require("../models/user.model");
const router = express.Router();

router.get("/me", verifyToken, async (req, res) => {
  const { userId } = req.user;

  try {
    const user = await UserModel.findById(userId);
    res.json({ user });
  } catch (error) {
    res.status(500);
    res.json({ message: error.message });
  }
});

module.exports = router;

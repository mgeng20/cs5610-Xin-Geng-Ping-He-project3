const express = require("express");
const router = express.Router();
const passwordController = require("../controllers/password.controller");
const { verifyToken } = require("../middleware/authMiddleware");

router.get("/", verifyToken, passwordController.getAllPasswords);
router.post("/", passwordController.createPassword);
router.put("/:id", verifyToken, passwordController.updatePassword);
router.delete("/:id", verifyToken, passwordController.deletePassword);
router.post("/share", verifyToken, passwordController.sharePassword);

module.exports = router;

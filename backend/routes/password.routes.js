const express = require("express");
const router = express.Router();
const passwordController = require("../controllers/password.controller");
const { verifyToken } = require("../middleware/authMiddleware");

router.get("/", verifyToken, passwordController.getAllPasswords);
router.post("/", verifyToken, passwordController.createPassword);
router.put("/:id", passwordController.updatePassword);
router.delete("/:id", passwordController.deletePassword);
router.post("/share", passwordController.sharePassword);

module.exports = router;

const express = require("express");
const router = express.Router();
const passwordController = require("../controllers/password.controller");
const { verifyToken } = require("../middleware/authMiddleware");

router.get("/", verifyToken, passwordController.getAllPasswords);
router.post("/", verifyToken, passwordController.createPassword);
router.put("/:id", verifyToken, passwordController.updatePassword);
router.delete("/:id", verifyToken, passwordController.deletePassword);
router.post("/generate", verifyToken, passwordController.generatePassword);

router.post("/share", verifyToken, passwordController.sharePassword);
router.get("/shared", verifyToken, passwordController.getSharedPasswords);

router.get("/share-requests", verifyToken, passwordController.getShareRequests);
router.delete(
  "/share-request/:id",
  verifyToken,
  passwordController.deleteShareRequest
);
router.put(
  "/share-request/:id/accept",
  verifyToken,
  passwordController.acceptShareRequest
);

module.exports = router;

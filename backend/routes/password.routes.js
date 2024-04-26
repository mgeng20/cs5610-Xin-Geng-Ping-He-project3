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
router.put("/shared/:shareRequestId", verifyToken, passwordController.updateShareRequest);
router.get('/share-requests', verifyToken, passwordController.getShareRequests);
router.put('/:passwordId/share-requests/:requestId', verifyToken, passwordController.updateShareRequest);
router.get('/received-share-requests', verifyToken, passwordController.getReceivedShareRequests);

module.exports = router;

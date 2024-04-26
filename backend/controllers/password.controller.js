const PasswordModel = require("../models/password.model");
const UserModel = require("../models/user.model");
const crypto = require("crypto");

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

function generatePassword(length, useAlphanumeric, useSymbols) {
  let charset = "";
  let password = "";

  if (useAlphanumeric) {
    charset += "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  }
  if (useSymbols) {
    charset += "!@#$%^&*()_+~`|}{[]:;?><,./-=";
  }

  // 确保每个选中的字符集都至少出现一次
  if (useAlphanumeric) {
    password += getRandomChar(
      "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ"
    );
    password += getRandomChar("0123456789");
  }
  if (useSymbols) {
    password += getRandomChar("!@#$%^&*()_+~`|}{[]:;?><,./-=");
  }

  for (let i = password.length; i < length; i++) {
    password += getRandomChar(charset);
  }

  password = shuffleString(password);

  return password;
}

function getRandomChar(charset) {
  return charset.charAt(Math.floor(Math.random() * charset.length));
}

function shuffleString(str) {
  return str
    .split("")
    .sort(() => Math.random() - 0.5)
    .join("");
}

exports.generatePassword = async (req, res) => {
  try {
    const { service, alphabet, numerals, symbols, length } = req.body;
    const { userId } = req.user;

    const generatedPassword = generatePassword(
      length,
      alphabet || numerals,
      symbols
    );

    const newPassword = await PasswordModel.create({
      service,
      password: generatedPassword,
      user: userId,
      lastUpdated: new Date(),
    });

    res.status(201).json(newPassword);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error generating password", error: error.message });
  }
};

exports.updatePassword = async (req, res) => {
  try {
    const { password } = req.body;
    const lastUpdated = new Date();
    const updatedPassword = await PasswordModel.findByIdAndUpdate(
      req.params.id,
      { password, lastUpdated },
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
    const { sharedWith, passwordId } = req.body;
    const { userId } = req.user;

    const recipient = await UserModel.findOne({ username: sharedWith });
    if (!recipient) {
      return res.status(404).json({ message: "User not found" });
    }

    if (recipient._id.toString() === userId) {
      return res.status(400).json({ message: "Cannot share with yourself" });
    }

    const password = await PasswordModel.findById(passwordId);
    if (!password) {
      return res.status(404).json({ message: "Password not found" });
    }

    // 检查是否已经发送过共享请求
    if (
      password.shareRequests.some(
        (request) => request.recipient.toString() === recipient._id.toString()
      )
    ) {
      return res
        .status(400)
        .json({ message: "Share request already sent to this user" });
    }

    password.shareRequests.push({
      sender: userId,
      recipient: recipient._id,
    });

    await password.save();

    res.json({ message: "Password share request sent successfully" });
  } catch (error) {
    res.status(500).json({
      message: "Error sending password share request",
      error: error.message,
    });
  }
};
exports.getShareRequests = async (req, res) => {
  try {
    const { userId } = req.user;
    const shareRequests = await PasswordModel.find({
      sharedWith: userId,
    });
    // .populate("shareRequests.sender", "username")
    // .select("shareRequests");
    res.json(shareRequests);
  } catch (error) {
    res.status(500).json({
      message: "Error retrieving share requests",
      error: error.message,
    });
  }
};
exports.sharePassword = async (req, res) => {
  try {
    const { sharedWith, passwordId } = req.body;
    const password = await PasswordModel.findById(passwordId);
    if (!password) {
      return res.status(404).json({ message: "Password not found" });
    }
    password.sharedWith = sharedWith;
    await password.save();
    res.json({ message: "Password shared successfully" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error sharing password", error: error.message });
  }
};

exports.sharePassword = async (req, res) => {
  try {
    const { sharedWith, passwordId } = req.body;
    const { userId } = req.user;

    const receiver = await UserModel.findOne({ username: sharedWith });
    if (!receiver) {
      return res.status(404).json({ message: "User not found" });
    }

    if (receiver._id.toString() === userId) {
      return res.status(400).json({ message: "Cannot share with yourself" });
    }

    const password = await PasswordModel.findById(passwordId);
    if (!password) {
      return res.status(404).json({ message: "Password not found" });
    }

    if (password.sharedWith.includes(receiver._id)) {
      return res
        .status(400)
        .json({ message: "Password already shared with this user" });
    }

    password.sharedWith.push(receiver._id);
    await password.save();

    res.json({ message: "Password shared successfully" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error sharing password", error: error.message });
  }
};

exports.getSharedPasswords = async (req, res) => {
  try {
    const { userId } = req.user;
    const sharedPasswords = await PasswordModel.find({ sharedWith: userId })
      .populate("user", "username")
      .exec();
    res.json(sharedPasswords);
  } catch (error) {
    res.status(500).json({
      message: "Error retrieving shared passwords",
      error: error.message,
    });
  }
};

exports.updateShareRequest = async (req, res) => {
  try {
    const { passwordId, requestId } = req.params;
    const { accepted } = req.body;
    const { userId } = req.user;

    const password = await PasswordModel.findById(passwordId);
    if (!password) {
      return res.status(404).json({ message: "Password not found" });
    }

    const shareRequest = password.shareRequests.id(requestId);
    if (!shareRequest) {
      return res.status(404).json({ message: "Share request not found" });
    }

    if (shareRequest.recipient.toString() !== userId) {
      return res
        .status(403)
        .json({ message: "Not authorized to update this share request" });
    }

    if (accepted) {
      shareRequest.status = "accepted";
    } else {
      shareRequest.status = "rejected";
    }

    await password.save();

    res.json({ message: "Share request updated successfully" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error updating share request", error: error.message });
  }
};

exports.getReceivedShareRequests = async (req, res) => {
  try {
    const { userId } = req.user;
    const receivedShareRequests = await PasswordModel.aggregate([
      {
        $match: { "shareRequests.recipient": mongoose.Types.ObjectId(userId) },
      },
      { $unwind: "$shareRequests" },
      {
        $match: { "shareRequests.recipient": mongoose.Types.ObjectId(userId) },
      },
      {
        $lookup: {
          from: "users",
          localField: "shareRequests.sender",
          foreignField: "_id",
          as: "shareRequests.sender",
        },
      },
      { $unwind: "$shareRequests.sender" },
      {
        $project: {
          _id: "$shareRequests._id",
          password: {
            _id: "$_id",
            service: "$service",
          },
          sender: {
            _id: "$shareRequests.sender._id",
            username: "$shareRequests.sender.username",
          },
          status: "$shareRequests.status",
        },
      },
    ]);
    res.json(receivedShareRequests);
  } catch (error) {
    res.status(500).json({
      message: "Error retrieving received share requests",
      error: error.message,
    });
  }
};

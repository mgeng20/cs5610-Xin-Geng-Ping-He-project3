const PasswordModel = require("../models/password.model");
const UserModel = require("../models/user.model");
const ShareRequestModel = require("../models/shareRequest.model");
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

function generatePassword(length, useAlphabet, useNumerals, useSymbols) {
  let charset = "";
  let password = "";

  if (useAlphabet) {
    charset += "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";
  }
  if (useNumerals) {
    charset += "0123456789";
  }
  if (useSymbols) {
    charset += "!@#$%^&*()_+~`|}{[]:;?><,./-=";
  }

  if (useAlphabet) {
    password += getRandomChar(
      crypto,
      "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ"
    );
  }
  if (useNumerals) {
    password += getRandomChar(crypto, "0123456789");
  }
  if (useSymbols) {
    password += getRandomChar(crypto, "!@#$%^&*()_+~`|}{[]:;?><,./-=");
  }

  for (let i = password.length; i < length; i++) {
    password += getRandomChar(crypto, charset);
  }

  password = shuffleString(crypto, password);

  return password;
}

function getRandomChar(crypto, charset) {
  const randomBytes = crypto.randomBytes(1);
  const randomIndex = randomBytes[0] % charset.length;
  return charset[randomIndex];
}

function shuffleString(crypto, str) {
  const arr = str.split("");
  for (let i = arr.length - 1; i > 0; i--) {
    const randomBytes = crypto.randomBytes(1);
    const randomIndex = randomBytes[0] % (i + 1);
    [arr[i], arr[randomIndex]] = [arr[randomIndex], arr[i]];
  }
  return arr.join("");
}

exports.generatePassword = async (req, res) => {
  try {
    const { service, alphabet, numerals, symbols, length } = req.body;
    const { userId } = req.user;

    if (!alphabet && !numerals && !symbols) {
      return res
        .status(400)
        .json({ message: "At least one character set must be selected" });
    }
    if (length < 4 || length > 50) {
      return res
        .status(400)
        .json({ message: "Password length must be between 4 and 50" });
    }

    const generatedPassword = generatePassword(
      length,
      alphabet,
      numerals,
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

    const record = await ShareRequestModel.findOne({
      sender: userId,
      password: password,
      recipient: recipient,
    });
    if (record) {
      // password.shareRequests.some(
      //   (request) => request.recipient.toString() === recipient._id.toString()
      // )
      return res
        .status(400)
        .json({ message: "Share request already sent to this user" });
    }

    const newShareRequest = await ShareRequestModel.create({
      sender: userId,
      recipient,
      password,
    });
    res.status(201).json(newShareRequest);
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
    const shareRequests = await ShareRequestModel.find({
      recipient: userId,
    })
      .populate("sender")
      .populate("password");
    res.json(shareRequests);
  } catch (error) {
    res.status(500).json({
      message: "Error retrieving share requests",
      error: error.message,
    });
  }
};

// exports.sharePassword = async (req, res) => {
//   try {
//     const { sharedWith, passwordId } = req.body;
//     const password = await PasswordModel.findById(passwordId);
//     if (!password) {
//       return res.status(404).json({ message: "Password not found" });
//     }
//     password.sharedWith = sharedWith;
//     await password.save();
//     res.json({ message: "Password shared successfully" });
//   } catch (error) {
//     res
//       .status(500)
//       .json({ message: "Error sharing password", error: error.message });
//   }
// };

// exports.sharePassword = async (req, res) => {
//   try {
//     const { sharedWith, passwordId } = req.body;
//     const { userId } = req.user;

//     const receiver = await UserModel.findOne({ username: sharedWith });
//     if (!receiver) {
//       return res.status(404).json({ message: "User not found" });
//     }

//     if (receiver._id.toString() === userId) {
//       return res.status(400).json({ message: "Cannot share with yourself" });
//     }

//     const password = await PasswordModel.findById(passwordId);
//     if (!password) {
//       return res.status(404).json({ message: "Password not found" });
//     }

//     if (password.sharedWith.includes(receiver._id)) {
//       return res
//         .status(400)
//         .json({ message: "Password already shared with this user" });
//     }

//     password.sharedWith.push(receiver._id);
//     await password.save();

//     res.json({ message: "Password shared successfully" });
//   } catch (error) {
//     res
//       .status(500)
//       .json({ message: "Error sharing password", error: error.message });
//   }
// };

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

exports.deleteShareRequest = async (req, res) => {
  try {
    await ShareRequestModel.findByIdAndDelete(req.params.id);
    res.json({ message: "Request deleted successfully" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error deleting request", error: error.message });
  }
};
exports.acceptShareRequest = async (req, res) => {
  try {
    const { userId } = req.user;
    const shareRequest = await ShareRequestModel.findById(
      req.params.id
    ).populate("password");

    const { password } = shareRequest;

    password.sharedWith.push(userId);

    await password.save();
    await shareRequest.deleteOne();

    res.status(200).json({ ok: true });
  } catch (e) {
    res.status(500).json({ message: "Error accept request", error: e.message });
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

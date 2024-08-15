import asyncHandler from "../middlewares/asyncHandler.js";
import User from "../models/userModel.js";

const verifyEmail = asyncHandler(async (req, res) => {
  const { token } = req.query; // Get token from query parameters

  // Find the user by verification token (you need to implement token storage and validation)
  const user = await User.findOne({ verificationToken: token });

  if (user) {
    user.isVerified = true;
    user.verificationToken = undefined; // Remove the token after successful verification
    await user.save();

    res.status(200).json({ message: "Email successfully verified" });
  } else {
    res.status(400).json({ message: "Invalid or expired verification token" });
  }
});

export { verifyEmail };

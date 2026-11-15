import bcrypt from "bcryptjs";
import User from "../models/User.js";
import { generateToken } from "../lib/utils.js";
import cloudinary from "../lib/cloudinary.js";

// Signup a new user
export const signup = async (req, res) => {
  const { fullName, email, password, bio } = req.body;

  try {
    if (!fullName || !email || !password) {
      return res.status(400).json({ success: false, message: "Missing required details" });
    }

    if (password.length < 6) {
      return res.status(400).json({ success: false, message: "Password must be at least 6 characters" });
    }

    const user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ success: false, message: "Account already exists with this email" });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = await User.create({
      fullName,
      email,
      password: hashedPassword,
      bio: bio || "Active on PulseChat! ⚡",
    });

    const token = generateToken(newUser._id);

    const userResponse = newUser.toObject();
    delete userResponse.password;

    res.status(201).json({
      success: true,
      userData: userResponse,
      token,
      message: "Account created successfully",
    });
  } catch (error) {
    console.log("Error in signup controller:", error.message);
    res.status(500).json({ success: false, message: error.message });
  }
};

// Login a user
export const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    if (!email || !password) {
      return res.status(400).json({ success: false, message: "Email and password are required" });
    }

    const userData = await User.findOne({ email });
    if (!userData) {
      return res.status(400).json({ success: false, message: "Invalid email or password" });
    }

    const isPasswordCorrect = await bcrypt.compare(password, userData.password);
    if (!isPasswordCorrect) {
      return res.status(400).json({ success: false, message: "Invalid email or password" });
    }

    const token = generateToken(userData._id);

    const userResponse = userData.toObject();
    delete userResponse.password;

    res.status(200).json({
      success: true,
      userData: userResponse,
      token,
      message: "Login successful",
    });
  } catch (error) {
    console.log("Error in login controller:", error.message);
    res.status(500).json({ success: false, message: error.message });
  }
};

// Check if user is authenticated
export const checkAuth = (req, res) => {
  try {
    res.json({ success: true, user: req.user });
  } catch (error) {
    console.log("Error in checkAuth controller:", error.message);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

// Update user profile details
export const updateProfile = async (req, res) => {
  try {
    const { profilePic, bio, fullName } = req.body;
    const userId = req.user._id;

    let updatedFields = {};
    if (bio !== undefined) updatedFields.bio = bio;
    if (fullName !== undefined && fullName.trim() !== "") updatedFields.fullName = fullName;

    if (profilePic) {
      try {
        if (profilePic.startsWith("data:image")) {
          const upload = await cloudinary.uploader.upload(profilePic);
          updatedFields.profilePic = upload.secure_url;
        } else {
          updatedFields.profilePic = profilePic;
        }
      } catch (uploadError) {
        console.log("Cloudinary upload fallback/error:", uploadError.message);
        updatedFields.profilePic = profilePic;
      }
    }

    const updatedUser = await User.findByIdAndUpdate(userId, updatedFields, { new: true }).select("-password");

    res.status(200).json({
      success: true,
      user: updatedUser,
      message: "Profile updated successfully",
    });
  } catch (error) {
    console.log("Error in update profile controller:", error.message);
    res.status(500).json({ success: false, message: error.message });
  }
};

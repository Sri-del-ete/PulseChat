import Message from "../models/Message.js";
import User from "../models/User.js";
import cloudinary from "../lib/cloudinary.js";
import { io, userSocketMap } from "../server.js";

// Get all users except logged in user
export const getUsersForSidebar = async (req, res) => {
  try {
    const userId = req.user._id;
    const filteredUsers = await User.find({ _id: { $ne: userId } }).select("-password");

    // Count number of messages not seen for each user
    const unseenMessages = {};
    const promises = filteredUsers.map(async (user) => {
      const messages = await Message.find({
        senderId: user._id,
        receiverId: userId,
        seen: false,
      });
      if (messages.length > 0) {
        unseenMessages[user._id] = messages.length;
      }
    });

    await Promise.all(promises);

    res.json({
      success: true,
      users: filteredUsers,
      unseenMessages,
    });
  } catch (error) {
    console.log("error: ", error.message);
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get all messages for selected user
export const getMessages = async (req, res) => {
  try {
    const { id: selectedUserId } = req.params;
    const myId = req.user._id;

    const messages = await Message.find({
      $or: [
        { senderId: myId, receiverId: selectedUserId },
        { senderId: selectedUserId, receiverId: myId },
      ],
    }).sort({ createdAt: 1 });

    res.json({ success: true, messages });
  } catch (error) {
    console.log("error: ", error.message);
    res.status(500).json({ success: false, message: error.message });
  }
};

// Mark messages as seen
export const markMessageAsSeen = async (req, res) => {
  try {
    const { id } = req.params;
    const myId = req.user._id;

    // Check if id is a user ID (to mark all incoming from user as seen) or specific message ID
    await Message.updateMany(
      { senderId: id, receiverId: myId, seen: false },
      { seen: true }
    );

    // Also support marking a specific message ID
    await Message.findByIdAndUpdate(id, { seen: true });

    // Notify the sender that messages were seen
    const senderSocketId = userSocketMap[id];
    if (senderSocketId) {
      io.to(senderSocketId).emit("messagesSeen", { seenBy: myId });
    }

    res.json({ success: true });
  } catch (error) {
    console.log("error: ", error.message);
    res.status(500).json({ success: false, message: error.message });
  }
};

// Send message to selected user
export const sendMessage = async (req, res) => {
  try {
    const { text, image } = req.body;
    const receiverId = req.params.id;
    const senderId = req.user._id;

    let imageUrl = "";
    if (image) {
      try {
        if (image.startsWith("data:image")) {
          const uploadResponse = await cloudinary.uploader.upload(image);
          imageUrl = uploadResponse.secure_url;
        } else {
          imageUrl = image;
        }
      } catch (uploadErr) {
        console.log("Cloudinary upload failed in sendMessage:", uploadErr.message);
        imageUrl = image;
      }
    }

    const newMessage = await Message.create({
      senderId,
      receiverId,
      text: text || "",
      image: imageUrl,
      seen: false,
    });

    // Emit the new message to the receiver's socket
    const receiverSocketId = userSocketMap[receiverId];
    if (receiverSocketId) {
      io.to(receiverSocketId).emit("newMessage", newMessage);
    }

    res.status(201).json({ success: true, newMessage });
  } catch (error) {
    console.log("error: ", error.message);
    res.status(500).json({ success: false, message: error.message });
  }
};

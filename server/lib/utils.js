import jwt from "jsonwebtoken";

export const generateToken = (userId) => {
  const secret = process.env.JWT_SECRET || "quickchat_super_secret_jwt_key_2026";
  const token = jwt.sign({ userId }, secret, {
    expiresIn: "7d",
  });
  return token;
};

import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User from "./models/userModel.js";
const SECRET_KEY = process.env.SECRET_KEY;

export const hashPassword = async (password) => {
  const salt = await bcrypt.genSalt(10);
  const combined = password + process.env.PEPPER_KEY;
  const hashedPassword = bcrypt.hash(combined, salt);
  return hashedPassword;
};

export const comparePassword = async (password, hashedPassword) => {
  const combined = password + process.env.PEPPER_KEY;
  const match = await bcrypt.compare(combined, hashedPassword);
  return match;
};

export const generateToken = (_id) => {
  const token = jwt.sign({ _id }, SECRET_KEY, { expiresIn: "3d" });
  return token;
};

export const verifyToken = (token) => {
  const verified = jwt.verify(token, SECRET_KEY);
  return verified;
};

export const requireAuth = () => {
  return async (req, res, next) => {
    try {
      const token = req.cookies?.token;
      if (!token) {
        throw new Error("Token required");
      }
      const _id = verifyToken(token);
      const user = await User.findById(_id);
      if (!user) {
        throw new Error("User not found");
      }
      req.user = user;
    } catch (error) {
      console.error(error.message);
      return res.status(401).send(`Request not authorized: ${error.message}`);
    }
    next();
  };
};

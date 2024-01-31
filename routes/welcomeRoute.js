import express from "express";
import User from "../models/userModel.js";
import { generateToken } from "../helpers";
const router = express.Router();

router.post("/welcome/sign-up", async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).send("All fields must be filled");
  }
  try {
    const user = await User.signUp(email, password);
    const token = generateToken(user._id);
    res.cookie("token", token, {
      httpOnly: true,
      maxAge: 3 * 24 * 60 * 60 * 1000,
      sameSite: "none",
      secure: true,
    });
    return res.status(201).send(user.clean());
  } catch (err) {
    const code = err.statusCode || 500;
    res.status(code).send(err.message);
    console.error(err);
  }
});

router.post("/welcome/log-in", async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).send("All fields must be filled");
  }
  try {
    const user = await User.logIn(email, password);
    const token = generateToken(user._id);
    res.cookie("token", token, {
      httpOnly: true,
      maxAge: 3 * 24 * 60 * 60 * 1000,
      sameSite: "none",
      secure: true,
    });
    return res.status(202).send(user.clean());
  } catch (err) {
    const code = err.statusCode || 500;
    res.status(code).send(err.message);
    console.error(err);
  }
});

export default router;

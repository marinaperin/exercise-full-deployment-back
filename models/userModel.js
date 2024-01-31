import mongoose, { Schema, SchemaTypes, model } from "mongoose";
import validator from "validator";
import { comparePassword, hashPassword } from "../helpers";
const { isStrongPassword, isEmail } = validator;

const strongPasswordOptions = {
  minLength: 8,
  minLowerCase: 1,
  minUpperCase: 1,
  minNumbers: 1,
  minSymbols: 1,
};

const schema = new Schema({
  email: {
    type: String,
    required: true,
    trim: true,
    index: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  subscription_date: {
    type: Date,
    default: () => Date.now(),
  },
  is_admin: {
    type: Boolean,
    default: false,
  },
});

schema.statics.findByEmail = function (email) {
  return this.findOne({ email });
};

schema.statics.signUp = async function (email, password) {
  if (!isEmail(email)) {
    const error = new Error("Insert valid email");
    error.statusCode = 400;
    throw error;
  }
  if (!isStrongPassword(password, strongPasswordOptions)) {
    const error = new Error("Password not strong enough");
    error.statusCode = 400;
    throw error;
  }
  const emailExists = await this.exists({ email });
  if (emailExists) {
    const error = new Error("Email already in use");
    error.statusCode = 400;
    throw error;
  }
  const hashedPassword = hashPassword(password);
  const user = await this.create({ email, password });
  return user;
};

schema.statics.logIn = async function (email, password) {
  const user = await this.findByEmail(email);
  const fail = () => {
    const error = new Error("Incorrect email or password");
    error.statusCode = 401;
    throw error;
  };
  if (!user) {
    fail();
  }
  const passwordMatch = await comparePassword(password, user.password);
  if (!passwordMatch) {
    fail();
  }
  return user;
};

schema.methods.clean = function () {
  const user = this.toObject();
  delete user.password;
  delete user.__v;
  delete user._id;
  return user;
};

const User = model("User", schema);
export default User;

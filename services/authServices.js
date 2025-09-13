import jwt from "jsonwebtoken";

import HttpError from "../helpers/HttpError.js";

import User from "../models/user.js";

export const registerUser = async ({ email, password }) => {
  const existingUser = await User.findOne({ where: { email } });
  if (existingUser) {
    throw HttpError(409, "Email is already in use");
  }

  const newUser = await User.create({ email, password });
  return newUser;
};

export const loginUser = async (email, password) => {
  const user = await User.findOne({ where: { email } });

  if (!user || user.password !== password) {
    throw HttpError(401, "Invalid email or password");
  }

  const payload = {
    id: user.id,
    email: user.email,
  };

  const token = jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: "1h",
  });

  // Store token in user record
  await user.update({ token });

  return {
    token,
    user: {
      email: user.email,
      subscription: user.subscription,
    },
  };
};

export const logoutUser = async (userId) => {
  const user = await User.findByPk(userId);
  if (!user) {
    throw HttpError(404, "User not found");
  }

  await user.update({ token: null });
};

export const getCurrentUser = async (userId) => {
  const user = await User.findByPk(userId);
  if (!user) {
    throw HttpError(404, "User not found");
  }

  return {
    email: user.email,
    subscription: user.subscription,
  };
};

export const updateUserSubscription = async (userId, subscription) => {
  const validSubscriptions = ["starter", "pro", "business"];

  if (!validSubscriptions.includes(subscription)) {
    throw HttpError(400, "Invalid subscription type");
  }

  const user = await User.findByPk(userId);
  if (!user) {
    throw HttpError(404, "User not found");
  }

  await user.update({ subscription });

  return {
    email: user.email,
    subscription: user.subscription,
  };
};

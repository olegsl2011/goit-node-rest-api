import jwt from "jsonwebtoken";
import gravatar from "gravatar";
import { v4 as uuidv4 } from "uuid";

import User from "../models/user.js";

import HttpError from "../helpers/HttpError.js";

import { sendVerificationEmail } from "./emailService.js";

export const registerUser = async ({ email, password }) => {
  const existingUser = await User.findOne({ where: { email } });
  if (existingUser) {
    throw HttpError(409, "Email in use");
  }

  const verificationToken = uuidv4();

  const avatarUrl = gravatar.url(email, {
    s: "200",
    r: "pg",
    d: "identicon",
    protocol: "https",
  });

  const newUser = await User.create({
    email,
    password,
    avatarUrl,
    verificationToken,
    verify: false,
  });

  try {
    await sendVerificationEmail(email, verificationToken);
    console.log(`Verification email sent to ${email}`);
  } catch (emailError) {
    console.error("Failed to send verification email:", emailError);
  }

  return {
    email: newUser.email,
    subscription: newUser.subscription,
    avatarUrl: newUser.avatarUrl,
  };
};

export const loginUser = async (email, password) => {
  const user = await User.findOne({ where: { email } });

  if (!user || user.password !== password) {
    throw HttpError(401, "Invalid email or password");
  }

  if (!user.verify) {
    throw HttpError(401, "Email not verified");
  }

  const payload = {
    id: user.id,
    email: user.email,
  };

  const token = jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: "1h",
  });

  await user.update({ token });
  return {
    token,
    user: {
      email: user.email,
      subscription: user.subscription,
      avatarUrl: user.avatarUrl,
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
    avatarUrl: user.avatarUrl,
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

export const updateUserAvatar = async (userId, avatarUrl) => {
  const user = await User.findByPk(userId);
  if (!user) {
    throw HttpError(404, "User not found");
  }

  await user.update({ avatarUrl });

  return {
    email: user.email,
    subscription: user.subscription,
    avatarUrl: user.avatarUrl,
  };
};

export const verifyUser = async (verificationToken) => {
  const user = await User.findOne({ where: { verificationToken } });

  if (!user) {
    throw HttpError(404, "User not found");
  }

  await user.update({ verify: true, verificationToken: null });

  return {
    email: user.email,
    verify: user.verify,
  };
};

export const resendVerificationEmail = async (email) => {
  const user = await User.findOne({ where: { email } });

  if (!user) {
    throw HttpError(404, "User not found");
  }

  if (user.verify) {
    throw HttpError(400, "Verification has already been passed");
  }

  if (!user.verificationToken) {
    const verificationToken = uuidv4();
    await user.update({ verificationToken });
  }

  await sendVerificationEmail(user.email, user.verificationToken);

  return { message: "Verification email sent" };
};

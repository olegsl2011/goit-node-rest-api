import * as authServices from "../services/authServices.js";

export const register = async (req, res) => {
  try {
    const newUser = await authServices.registerUser(req.body);

    res.status(201).json({
      user: {
        email: newUser.email,
        subscription: newUser.subscription,
        avatarUrl: newUser.avatarUrl,
      },
    });
  } catch (error) {
    const { status = 500, message = "Internal Server Error" } = error;
    res.status(status).json({ message });
  }
};

export const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const data = await authServices.loginUser(email, password);

    res.status(200).json(data);
  } catch (error) {
    const { status = 500, message = "Internal Server Error" } = error;
    res.status(status).json({ message });
  }
};

export const logout = async (req, res) => {
  try {
    await authServices.logoutUser(req.user.id);
    res.status(204).json();
  } catch (error) {
    const { status = 500, message = "Internal Server Error" } = error;
    res.status(status).json({ message });
  }
};

export const getCurrentUser = async (req, res) => {
  try {
    const user = await authServices.getCurrentUser(req.user.id);
    res.status(200).json(user);
  } catch (error) {
    const { status = 500, message = "Internal Server Error" } = error;
    res.status(status).json({ message });
  }
};

export const updateSubscription = async (req, res) => {
  try {
    const { subscription } = req.body;

    if (!subscription) {
      return res
        .status(400)
        .json({ message: "Subscription field is required" });
    }

    const updatedUser = await authServices.updateUserSubscription(
      req.user.id,
      subscription
    );
    res.status(200).json(updatedUser);
  } catch (error) {
    const { status = 500, message = "Internal Server Error" } = error;
    res.status(status).json({ message });
  }
};

export const uploadAvatar = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "Avatar file is required" });
    }

    const avatarUrl = `/avatars/${req.file.filename}`;

    const updatedUser = await authServices.updateUserAvatar(
      req.user.id,
      avatarUrl
    );
    res.status(200).json(updatedUser);
  } catch (error) {
    const { status = 500, message = "Internal Server Error" } = error;
    res.status(status).json({ message });
  }
};

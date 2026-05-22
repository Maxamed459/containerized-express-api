import User from "../model/user.js";
import AppError from "../utils/AppError.js";

const normalizeUserInput = ({ username, email, password, role }) => ({
  username: username.trim().toLowerCase(),
  email: email.trim().toLowerCase(),
  password,
  role: role || "user",
});

export const createUser = async (userInput) => {
  const userData = normalizeUserInput(userInput);

  const existingUser = await User.findOne({
    $or: [{ email: userData.email }, { username: userData.username }],
  });

  if (existingUser) {
    throw new AppError("Username or email already exists", 409);
  }

  return User.create(userData);
};

export const authenticateUser = async ({ email, password }) => {
  const user = await User.findOne({ email: email.trim().toLowerCase() }).select(
    "+password"
  );

  if (!user) {
    throw new AppError("Invalid email or password", 401);
  }

  let passwordMatches = false;

  try {
    passwordMatches = await user.comparePassword(password);
  } catch {
    passwordMatches = false;
  }

  if (!passwordMatches) {
    if (user.password === password) {
      user.password = password;
      user.markModified("password");
      await user.save();
      return user;
    }

    throw new AppError("Invalid email or password", 401);
  }

  return user;
};

export const getUserById = async (userId) => {
  const user = await User.findById(userId);

  if (!user) {
    throw new AppError("User not found", 404);
  }

  return user;
};

export const getAllUsers = async () => {
  return User.find().sort({ createdAt: -1 });
};

import {
  authenticateUser,
  createUser,
  getAllUsers,
} from "../services/userService.js";
import { successResponse } from "../utils/apiResponse.js";
import { signToken } from "../utils/jwt.js";

export const registerUser = async (req, res, next) => {
  try {
    const user = await createUser(req.body);

    return successResponse(res, 201, "User registered successfully", { user });
  } catch (error) {
    return next(error);
  }
};

export const loginUser = async (req, res, next) => {
  try {
    const user = await authenticateUser(req.body);
    const token = signToken(user);

    return successResponse(res, 200, "Login successful", { token, user });
  } catch (error) {
    return next(error);
  }
};

export const getProfile = async (req, res, next) => {
  try {
    return successResponse(res, 200, "Profile fetched successfully", {
      user: req.user,
    });
  } catch (error) {
    return next(error);
  }
};

export const getUsers = async (req, res, next) => {
  try {
    const users = await getAllUsers();

    return successResponse(res, 200, "Users fetched successfully", { users });
  } catch (error) {
    return next(error);
  }
};

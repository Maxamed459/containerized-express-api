import { getUserById } from "../services/userService.js";
import AppError from "../utils/AppError.js";
import { verifyToken } from "../utils/jwt.js";

export const authenticate = async (req, res, next) => {
  try {
    const authorizationHeader = req.headers.authorization;

    if (!authorizationHeader || !authorizationHeader.startsWith("Bearer ")) {
      throw new AppError("Authentication token is required", 401);
    }

    const token = authorizationHeader.split(" ")[1];
    const decoded = verifyToken(token);
    const user = await getUserById(decoded.id);

    req.user = user;
    return next();
  } catch (error) {
    if (
      error.name === "JsonWebTokenError" ||
      error.name === "TokenExpiredError" ||
      error.name === "CastError"
    ) {
      return next(new AppError("Invalid or expired authentication token", 401));
    }

    return next(error);
  }
};

export const authorize = (...allowedRoles) => {
  return (req, res, next) => {
    if (!req.user) {
      return next(new AppError("Authentication is required", 401));
    }

    if (!allowedRoles.includes(req.user.role)) {
      return next(new AppError("You are not allowed to access this resource", 403));
    }

    return next();
  };
};

import jwt from "jsonwebtoken";
import { jwtConfig } from "../config/config.js";

export const signToken = (user) => {
  return jwt.sign(
    {
      id: user._id.toString(),
      role: user.role,
    },
    jwtConfig.secret,
    {
      expiresIn: jwtConfig.expiresIn,
    }
  );
};

export const verifyToken = (token) => {
  return jwt.verify(token, jwtConfig.secret);
};

import dotenv from "dotenv";

dotenv.config();

const dbUrl = process.env.MangoUrl;

export const jwtConfig = {
  secret: process.env.JWT_SECRET || "change-this-jwt-secret",
  expiresIn: process.env.JWT_EXPIRES_IN || "1d",
};

export default dbUrl;

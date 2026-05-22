import express from "express";
import {
  getProfile,
  getUsers,
  loginUser,
  registerUser,
} from "../controller/userController.js";
import { authenticate, authorize } from "../middlewares/authMiddleware.js";
import validateRequest from "../middlewares/validateRequest.js";
import {
  loginValidator,
  registerValidator,
} from "../validators/authValidators.js";

const router = express.Router();

router.post("/register", registerValidator, validateRequest, registerUser);
router.post("/login", loginValidator, validateRequest, loginUser);
router.get("/profile", authenticate, getProfile);
router.get("/users", authenticate, authorize("admin"), getUsers);

export default router;

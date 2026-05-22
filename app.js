import express from "express";
import connectDB from "./config/db.js";
import errorMiddleware from "./middlewares/errorMiddleware.js";
import userRoutes from "./routes/userRoutes.js";
import { errorResponse, successResponse } from "./utils/apiResponse.js";

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

app.get("/", (req, res) => {
  return successResponse(res, 200, "Welcome");
});

app.use("/api/v1/auth", userRoutes);

app.use((req, res) => {
  return errorResponse(res, 404, "Route not found");
});

app.use(errorMiddleware);

const startServer = async () => {
  await connectDB();

  app.listen(PORT, () => {
    console.log("Your server is running on port", PORT);
  });
};

startServer();

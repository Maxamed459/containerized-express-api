import express from "express";
const app = express();
import connectDB from "./config/db.js";
import { registerUser } from "./controller/userController.js";
const PORT = 3000;

app.use(express.json());

app.get("/", (req, res) => {
  res.send("Welcome");
});

app.post("/register", registerUser);

connectDB();

app.listen(PORT, () => {
  console.log("Youre server is running on port", PORT);
});

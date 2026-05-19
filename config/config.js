import dotenv from "dotenv";

dotenv.config();

const dbUrl = process.env.MangoUrl;
export default dbUrl;

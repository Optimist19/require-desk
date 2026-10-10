import express from "express";
import dotenv from "dotenv";
import db from "./config/db.js";
import cors from "cors";
import cookieParser from "cookie-parser";
import authRoute from "./routes/authRoute.js";
import userRoute from "./routes/userRoute.js";
import taskRoute from "./routes/taskRoute.js";

dotenv.config();
const PORT = process.env.PORT || 5000;

const app = express();

await db();

app.use(express.json());
app.use(cookieParser());
app.use(
  cors({
    origin: "https://require-desk.vercel.app/", 
    credentials: true
  })
);
// app.use(cookieParser());

app.use("/api/auth", authRoute);
app.use("/api/users", userRoute);
app.use("/api/request", taskRoute);
// app.use("/api/user", userRoute);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

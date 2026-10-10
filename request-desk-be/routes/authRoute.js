import express from "express";
import {
  login,
  logout,
  refreshToken,
  register
} from "../controller/authController.js";

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.post("/logout", logout);
router.get("/refreshToken", refreshToken);

export default router;

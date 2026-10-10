import express from "express";
import {
  deleteUser,
  // deleteUser,
  getAllUsers,
  getUser
} from "../controller/userController.js";
import { verifyRole, verifyToken } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/get-users", verifyToken, verifyRole("admin"), getAllUsers);
router.get("/get-user", verifyToken, getUser);
router.delete("/:id", verifyToken, verifyRole("admin"), deleteUser)


export default router;

import express from "express"
import { addRequest, getRequests, updateRequest } from "../controller/requestController.js"
import { verifyRole, verifyToken } from "../middleware/authMiddleware.js"

const router = express.Router()


router.post("/add", verifyToken, addRequest)
router.get("/getRequests", verifyToken, getRequests)
router.patch("/:id", verifyToken, verifyRole("admin"), updateRequest)

export default router
import express from "express";
import {
  deleteUserController,
  fetchAllUsers,
  getUserByIdController,
  updateUserByIdController,
} from "#controllers/users.controller.js";
import { authenticateToken } from "#middleware/auth.middleware.js";

const router = express.Router();

router.get("/", authenticateToken, fetchAllUsers);
router.get("/:id", authenticateToken, getUserByIdController);
router.put("/:id", authenticateToken, updateUserByIdController);
router.delete("/:id", authenticateToken, deleteUserController);

export default router;

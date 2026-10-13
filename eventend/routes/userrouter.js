import express from "express";
import userController from "../controller/usercontroller.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

// AUTH ROUTES
router.post("/login", userController.login);
router.post("/register", userController.register);

// PASSWORD RESET
router.post("/forgot-password", userController.forgotPassword);
router.post("/reset-password", userController.resetPassword);

// USER PROFILE
router.put("/me/password", protect, userController.updatePassword);

// ROLE MANAGEMENT (ADMIN ONLY FEATURE)
router.post("/update-role", protect, userController.updateRole);

// ADMIN/USER MANAGEMENT
router.get("/", protect, userController.getUsers);
router.get("/:id", protect, userController.getUserById);
router.delete("/:id", protect, userController.deleteUser);

export default router;
import express from "express";
import userController from "../controller/usercontroller.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/login", userController.login);
router.post("/register", userController.register);
router.post("/forgot-password", userController.forgotPassword);
router.post("/reset-password", userController.resetPassword);

router.put("/me/password", protect, userController.updatePassword);

router.post("/update-role", protect, userController.updateRole);
router.get("/", protect, userController.getUsers);
router.get("/:id", protect, userController.getUserById);
router.delete("/:id", protect, userController.deleteUser);


export default router;
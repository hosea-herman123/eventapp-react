import { authSchema } from "../helpers/validationschema.js";
import createError from "http-errors";
import User from "../models/user.js";
import { signAccessToken } from "../helpers/jwtjelpers.js";
import crypto from "crypto";
import bcrypt from "bcryptjs";

const userController = {

  // ================= REGISTER =================
  register: async (req, res, next) => {
    try {
      console.info("REGISTER payload:", req.body);

      const result = await authSchema.validateAsync(req.body);

      const exists = await User.findOne({ email: result.email });
      if (exists) {
        return next(
          createError.Conflict(`${result.email} is already registered`)
        );
      }

      const user = new User({
        email: result.email,
        password: result.password,

        // ✅ ALWAYS DEFAULT ROLE
        role: "customer",
      });

      const savedUser = await user.save();

      const accessToken = await signAccessToken(savedUser._id.toString());

      res.status(201).send({
        message: "Registration successful!",
        token: accessToken,
        user: {
          id: savedUser._id,
          email: savedUser.email,

          // ✅ SAFE FALLBACK
          role: savedUser.role || "customer",
        },
      });
    } catch (error) {
      console.error("REGISTER error:", error);
      if (error.isJoi)
        return next(createError.BadRequest("Invalid registration data"));
      next(error);
    }
  },

  // ================= LOGIN =================
  login: async (req, res, next) => {
    try {
      console.info("LOGIN payload:", req.body);

      const result = await authSchema.validateAsync(req.body);

      const user = await User.findOne({ email: result.email });
      if (!user) return next(createError.NotFound("User not registered"));

      const isMatch = await user.isValidPassword(result.password);
      if (!isMatch)
        return next(createError.Unauthorized("username/password not valid"));

      const accessToken = await signAccessToken(user._id.toString());

      res.send({
        message: "Login successful!",
        token: accessToken,

        user: {
          id: user._id,
          email: user.email,

          // ✅ CRITICAL FIX: NEVER allow undefined role
          role: user.role || "customer",
        },
      });
    } catch (error) {
      console.error("LOGIN error:", error);
      if (error.isJoi)
        return next(createError.BadRequest("invalid username/password"));
      next(error);
    }
  },

  // ================= UPDATE ROLE (SECURITY FIXED) =================
  updateRole: async (req, res, next) => {
    try {
      const { userId, role } = req.body;

      // ❌ ONLY ALLOW VALID ROLES
      const allowedRoles = ["admin", "customer", "employee"];
      if (!allowedRoles.includes(role)) {
        throw createError.BadRequest("Invalid role");
      }

      const user = await User.findByIdAndUpdate(
        userId,
        { role },
        { new: true }
      );

      if (!user) throw createError.NotFound("User not found");

      res.send({
        message: "Role updated successfully",
        user: {
          id: user._id,
          email: user.email,
          role: user.role,
        },
      });
    } catch (error) {
      next(error);
    }
  },

  // ================= OTHER FUNCTIONS (UNCHANGED BUT SAFE) =================

  forgotPassword: async (req, res, next) => {
    try {
      const { email } = req.body;

      const user = await User.findOne({ email });
      if (!user) throw createError.NotFound("User not registered");

      const resetToken = crypto.randomBytes(32).toString("hex");

      user.resetPasswordToken = resetToken;
      user.resetPasswordExpires = Date.now() + 3600000;

      await user.save();

      res.send({
        message: "Password reset link sent!",
        resetToken,
      });
    } catch (error) {
      next(error);
    }
  },

  resetPassword: async (req, res, next) => {
    try {
      const { token, newPassword } = req.body;

      const user = await User.findOne({
        resetPasswordToken: token,
        resetPasswordExpires: { $gt: Date.now() },
      });

      if (!user)
        throw createError.BadRequest("Invalid or expired token");

      user.password = newPassword;
      user.resetPasswordToken = undefined;
      user.resetPasswordExpires = undefined;

      await user.save();

      res.send({ message: "Password has been reset successfully!" });
    } catch (error) {
      next(error);
    }
  },

  getUsers: async (req, res) => {
    try {
      const users = await User.find().select("-password");
      res.status(200).send({ users });
    } catch (error) {
      res.status(500).send({ message: error.message || "Server error" });
    }
  },

  getUserById: async (req, res, next) => {
    try {
      const userId =
        req.params.id === "me" ? req.user.id : req.params.id;

      const user = await User.findById(userId);

      if (!user)
        return res.status(404).json({ message: "User not found" });

      res.json({
        user: {
          id: user._id,
          email: user.email,
          role: user.role || "customer",
        },
      });
    } catch (err) {
      next(err);
    }
  },

  deleteUser: async (req, res) => {
    try {
      const { id } = req.params;

      const user = await User.findByIdAndDelete(id);

      if (!user) {
        return res.status(404).send({ message: "User not found" });
      }

      res.send({ message: "User deleted successfully" });
    } catch (error) {
      res.status(500).send({ message: error.message || "Server error" });
    }
  },

  updatePassword: async (req, res, next) => {
    try {
      const { oldPassword, newPassword } = req.body;

      const user = await User.findById(req.userId);
      if (!user)
        return next(createError.NotFound("User not found"));

      const isMatch = await bcrypt.compare(
        oldPassword,
        user.password
      );

      if (!isMatch)
        return next(createError.Unauthorized("Old password incorrect"));

      user.password = newPassword;
      await user.save();

      res.send({ message: "Password updated successfully" });
    } catch (err) {
      next(err);
    }
  },
};

export default userController;
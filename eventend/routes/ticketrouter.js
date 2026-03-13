import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import ticketController from "../controller/ticketcontroller.js";

const router = express.Router();

router.get("/my", protect, ticketController.getMyTickets); 
router.get("/", protect, ticketController.getAllTickets); 

export default router;

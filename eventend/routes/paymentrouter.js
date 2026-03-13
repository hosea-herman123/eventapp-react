import express from "express";
import paymentController, { mpesaCallback, getTicketByTransaction } from "../controller/paymentcontroller.js";
import {protect} from "../middleware/authMiddleware.js";
import { verifyAccessToken } from "../helpers/jwtjelpers.js";

const router = express.Router();

router.post("/stkpush", protect, paymentController.initiatePayment);
router.post("/callback", express.json(), mpesaCallback);
router.get("/ticket/:transactionId", getTicketByTransaction);

export default router;

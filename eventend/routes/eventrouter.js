import express from "express";
import eventController from "../controller/eventcontroller.js";
// import { verifyToken } from "../middleware/auth.js";

const router = express.Router();

router.get("/", eventController.getEvents);
router.get("/:id", eventController.getEventById);
router.post("/",  eventController.createEvent);
router.put("/:id",  eventController.updateEvent);
router.delete("/:id", eventController.deleteEvent);

export default router;

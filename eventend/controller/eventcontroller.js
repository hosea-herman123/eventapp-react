import Event from "../models/event.js";
import Ticket from "../models/ticket.js";

const eventController = {

createEvent: async (req, res, next) => {
  try {
    console.log(" Incoming request body:", req.body);
    const {
      title,
      organizer,
      description,
      date,
      time,
      category,
      location,
      price,
      maxTickets,
      imageUrl,
    } = req.body;

    if (
      !title ||
      !organizer ||
      !description ||
      !date ||
      !time ||
      !category ||
      !location ||
      price === undefined ||
      !maxTickets
    ) {
      return res.status(400).send({ message: "All required fields must be filled" });
    }

const event = new Event({
  title,
  organizer,
  description,
  date,
  time,
  category,
  location,
  price: Number(price),       
  availableTickets: Number(maxTickets), 
  imageUrl: imageUrl || null,
  createdAt: new Date(),
});

    const savedEvent = await event.save();

   
    res.status(201).send({
      message: " Event created successfully",
      event: savedEvent,
    });
  } catch (error) {
    console.error(" Error creating event:", error.message, error); 
    res
      .status(500)
      .send({ message: error.message || "Server error" });
  }
},


 updateEvent: async (req, res, next) => {
  try {
    const { id } = req.params;

    const updates = { ...req.body };
    if (updates.maxTickets !== undefined) {
      updates.maxTickets = Number(updates.maxTickets);

      if (updates.availableTickets === undefined) {
        updates.availableTickets = updates.maxTickets;
      }
    }

    const event = await Event.findByIdAndUpdate(id, updates, { new: true });

    if (!event) {
      return res.status(404).send({ message: "Event not found" });
    }

    res.send({ message: " Event updated successfully", event });
  } catch (error) {
    console.error("🔥 Error updating event:", error.message, error);
    res.status(500).send({ message: error.message || "Server error" });
  }
},

deleteEvent: async (req, res, next) => {
  try {
    const { id } = req.params;

    const event = await Event.findByIdAndDelete(id);

    if (!event) {
      return res.status(404).send({ message: "Event not found" });
    }

    res.send({ message: " Event deleted successfully" });
  } catch (error) {
    console.error(" Error deleting event:", error.message, error);
    res.status(500).send({ message: error.message || "Server error" });
  }
},
  getEvents: async (req, res, next) => {
    try {
      const events = await Event.find().sort({ createdAt: -1 });
      res.status(200).send({ events });
    } catch (error) {
      console.error(" Error fetching events:", error.message, error);
      res.status(500).send({ message: error.message || "Server error" });
    }
  },

  getEventById: async (req, res, next) => {
    try {
      const { id } = req.params;
      const event = await Event.findById(id);

      if (!event) {
        return res.status(404).send({ message: "Event not found" });
      }

      res.status(200).send({ event });
    } catch (error) {
      console.error(" Error fetching single event:", error.message, error);
      res.status(500).send({ message: error.message || "Server error" });
    }
  },
};

export default eventController;

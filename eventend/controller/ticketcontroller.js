import Ticket from "../models/ticket.js";
import Event from "../models/event.js";

const ticketController = {
  getMyTickets: async (req, res) => {
    try {
      const tickets = await Ticket.find({ userId: req.user._id })
        .populate("eventId", "title date location price")
        .populate("userId", "name email")
        .sort({ createdAt: -1 });

      res.json({ tickets });
    } catch (err) {
      res.status(500).json({ message: "Failed to fetch tickets" });
    }
  },

  getAllTickets: async (req, res) => {
    try {
      if (req.user.role !== "admin") {
        return res.status(403).json({ message: "Not authorized" });
      }

      const tickets = await Ticket.find()
        .populate("userId", "name email")
        .populate("eventId", "title date price location")
        .sort({ createdAt: -1 });

        const soldByEvent = tickets.reduce((acc, ticket) => {
        const eventId = ticket.eventId._id.toString();
        if (!acc[eventId]) {
          acc[eventId] = { event: ticket.eventId, soldTickets: 0 };
        }
        acc[eventId].soldTickets += 1;
        return acc;
      }, {});

      const eventsWithSales = Object.values(soldByEvent).map((entry) => ({
        ...entry.event.toObject(),
        soldTickets: entry.soldTickets,
      }));

      res.json({ tickets, events: eventsWithSales });
    } catch (err) {
      res.status(500).json({ message: "Failed to fetch all tickets" });
    }
  },
};

export default ticketController;

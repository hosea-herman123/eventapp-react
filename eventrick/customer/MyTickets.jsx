import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

export default function MyTickets() {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTickets = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await fetch("http://localhost:4000/api/tickets/my", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        if (res.ok) {
          setTickets(data.tickets || []);
        } else {
          console.error("Failed to fetch tickets:", data.message);
        }
      } catch (err) {
        console.error("Error fetching tickets:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchTickets();
  }, []);

  const formatDate = (dateStr) =>
    new Date(dateStr).toLocaleDateString("en-US", {
      weekday: "short",
      month: "short",
      day: "numeric",
      year: "numeric",
    });

  const formatTime = (dateStr) =>
    new Date(dateStr).toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-16 min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-purple-600 border-t-transparent mx-auto"></div>
          <p className="mt-4 text-gray-400">Loading your tickets...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-16 min-h-screen text-gray-100">
      <div className="mb-12 text-center">
        <h1 className="text-4xl font-extrabold text-white drop-shadow-[2px_2px_4px_rgba(128,0,128,0.7)] leading-tight">
          My Tickets
        </h1>
        <p className="text-gray-400">View and manage your event tickets</p>
      </div>

      {tickets.length === 0 ? (
        <div className="text-center py-16 bg-gray-800/50 rounded-2xl shadow-lg border border-purple-800">
          <div className="text-6xl mb-4">🎟️</div>
          <h3 className="text-xl font-semibold text-gray-200 mb-2">
            No tickets yet
          </h3>
          <p className="text-gray-400 mb-6">
            You haven&apos;t purchased any tickets yet. Browse events to get started!
          </p>
          <Link
            to="/events"
            className="inline-block bg-purple-600 text-white px-5 py-2 rounded-lg hover:bg-purple-500 transition"
          >
            Browse Events
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {tickets.map((ticket) => {
            const event = ticket.eventId;
            const eventDate = new Date(event.date);
            const isPastEvent = eventDate < new Date();

            return (
              <div
                key={ticket._id}
                className="bg-gray-900 border border-purple-800 shadow-lg rounded-2xl overflow-hidden relative"
              >
                <div className="p-6">
                  <div className="flex justify-between items-start">
                    <div>
                      <span
                        className={`inline-block text-xs px-2 py-1 rounded-full ${
                          isPastEvent
                            ? "bg-gray-700 text-gray-400"
                            : "bg-purple-700/30 text-purple-400"
                        }`}
                      >
                        {isPastEvent ? "Past Event" : "Upcoming"}
                      </span>
                      <h2 className="text-xl font-bold mt-2 text-purple-300">
                        {event.title}
                      </h2>
                      <p className="text-gray-400">{event.location}</p>
                    </div>
                    <span className="text-sm border border-purple-700 px-2 py-1 rounded text-purple-400">
                      {ticket.status || "Pending"}
                    </span>
                  </div>

                  <div className="mt-4 grid grid-cols-2 gap-3 text-sm text-gray-400">
                    <div>📅 {formatDate(event.date)}</div>
                    <div>⏰ {formatTime(event.date)}</div>
                  </div>
                </div>

                <div className="relative border-t border-dashed border-gray-700">
                  <span className="absolute -left-3 -top-3 h-6 w-6 bg-gray-900 border border-gray-700 rounded-full"></span>
                  <span className="absolute -right-3 -top-3 h-6 w-6 bg-gray-900 border border-gray-700 rounded-full"></span>
                </div>

                <div className="p-6 flex justify-between items-center text-gray-300">
                  <div>
                    <p className="text-sm font-medium">Ticket Code</p>
                    <p className="text-sm font-mono text-purple-400">
                      {ticket.ticketCode || ticket._id.slice(-8).toUpperCase()}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium">Purchase Date</p>
                    <p className="text-sm text-gray-400">
                      {ticket.createdAt
                        ? new Date(ticket.createdAt).toLocaleDateString("en-US", {
                            weekday: "short",
                            month: "short",
                            day: "numeric",
                            year: "numeric",
                          })
                        : "—"}
                    </p>
                  </div>
                </div>

                <div className="p-6 pt-0 flex justify-between items-center">
                  <span className="text-lg font-bold text-purple-400">
                    KES {ticket.totalPrice}
                  </span>
                  <Link
                    to={`/events/${event._id}`}
                    className="text-sm px-3 py-1 border border-purple-700 rounded text-purple-300 hover:bg-purple-700/30"
                  >
                    View Event
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

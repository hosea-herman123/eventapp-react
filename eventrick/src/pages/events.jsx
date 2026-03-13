import React, { useState, useEffect } from "react";
import EventCard from "./dashboard";
import TicketPurchase from "../components/MpesaPaymentModal";
import "font-awesome/css/font-awesome.min.css";

const categories = [
  "All Categories",
  "Technology",
  "Business",
  "Design",
  "Health",
  "Music",
];

function Event() {
  const [events, setEvents] = useState([]);
  const [filteredEvents, setFilteredEvents] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All Categories");
  const [showMpesa, setShowMpesa] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const res = await fetch("http://localhost:4000/api/events");
        const data = await res.json();

        if (Array.isArray(data)) {
          setEvents(data);
          setFilteredEvents(data);
        } else if (Array.isArray(data.events)) {
          setEvents(data.events);
          setFilteredEvents(data.events);
        } else {
          setEvents([]);
          setFilteredEvents([]);
        }
      } catch (err) {
        console.error("Failed to fetch events:", err);
        setEvents([]);
        setFilteredEvents([]);
      }
    };

    fetchEvents();
  }, []);

  useEffect(() => {
    let filtered = events;

    if (searchTerm) {
      filtered = filtered.filter((ev) =>
        ev.title.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (selectedCategory && selectedCategory !== "All Categories") {
      filtered = filtered.filter(
        (ev) => ev.category?.toLowerCase() === selectedCategory.toLowerCase()
      );
    }

    setFilteredEvents(filtered);
  }, [searchTerm, selectedCategory, events]);

  const handleBuy = (event) => {
    setSelectedEvent(event);
    setShowMpesa(true);
  };

  const closeMpesa = () => {
    setShowMpesa(false);
    setSelectedEvent(null);
  };

  return (
    <section
      id="events"
      className="py-16 px-4 min-h-screen"
    >
      <div className="container max-w-screen-2xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-4xl text-white drop-shadow-[2px_2px_4px_rgba(128,0,128,0.7)] leading-tight font-extrabold">
            Upcoming Events
          </h2>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            Discover amazing events happening in your area and beyond
          </p>
        </div>

        <div className="flex flex-col md:flex-row gap-4 mb-8 max-w-4xl mx-auto">
          <div className="relative flex-1">
            <input
              type="text"
              placeholder="Search events..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-3 py-3 text-lg bg-gray-800 text-gray-100 placeholder-gray-400 border border-purple-700 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
            />
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <svg
                className="h-5 w-5 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </div>
          </div>

          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="w-full md:w-48 px-3 py-3 text-lg bg-gray-800 text-gray-100 border border-purple-700 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
          >
            {categories.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {filteredEvents.length > 0 ? (
            filteredEvents.map((event) => (
              <EventCard key={event._id} event={event} onBuy={handleBuy} />
            ))
          ) : (
            <p className="text-center col-span-full text-gray-400 font-bold">
              No events found.
            </p>
          )}
        </div>

        <div className="text-center">
          <button className="px-6 py-3 rounded-lg text-white font-semibold bg-purple-700 hover:bg-purple-600 hover:shadow-lg hover:shadow-purple-500/30 transition-colors duration-300">
            Load More Events
          </button>
        </div>
      </div>

      {showMpesa && selectedEvent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4">
          <div className="w-full max-w-lg bg-gray-900 rounded-lg shadow-2xl p-6 relative border border-purple-700">
            <button
              onClick={closeMpesa}
              className="absolute top-3 right-3 text-gray-400 hover:text-white transition"
            >
              ✕
            </button>

            <h3 className="text-2xl font-bold text-purple-400 mb-4">
              {selectedEvent.title}
            </h3>

            <TicketPurchase
              eventId={selectedEvent._id}
              amount={selectedEvent.price}
              accountRef={`EVT-${selectedEvent._id}`}
              description={selectedEvent.title}
            />
          </div>
        </div>
      )}
    </section>
  );
}

export default Event;

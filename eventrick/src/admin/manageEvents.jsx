import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";

const ManageEvents = () => {
  const [events, setEvents] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [deletingId, setDeletingId] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const res = await fetch("http://localhost:4000/api/events");
        const data = await res.json();

        console.log("Fetched events:", data);

        if (Array.isArray(data)) {
          setEvents(data);
        } else if (Array.isArray(data.events)) {
          setEvents(data.events);
        } else {
          setEvents([]);
        }
        setError(null);
      } catch (err) {
        console.error("Failed to fetch events:", err);
        setEvents([]);
        setError("Failed to load events. Please try again later.");
      }
    };

    fetchEvents();
  }, []);

  const handleDeleteEvent = async (id) => {
    try {
      setDeletingId(id);
      await fetch(`http://localhost:4000/api/events/${id}`, {
        method: "DELETE",
      });
      setEvents(events.filter((e) => e._id !== id));
    } catch (err) {
      console.error(err);
      alert("Failed to delete event. Check backend logs.");
    } finally {
      setDeletingId(null);
    }
  };

  const filteredEvents = Array.isArray(events)
    ? events.filter((ev) =>
        ev.title?.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : [];

  return (
    <div className="min-h-screen bg-[#0A1F44] font-['Orbitron','Roboto',sans-serif] flex flex-col md:flex-row">
      {/* Sidebar */}
      <div
        className={`fixed inset-y-0 left-0 w-64 bg-[#1A2B3C] border-r border-[#00FF85] transform ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        } md:translate-x-0 transition-transform duration-300 z-20 md:sticky md:top-0`}
      >
        <div className="p-6">
          <h2 className="text-xl text-[#E0E0FF] font-bold mb-6">Filter Events</h2>
          <input
            placeholder="Search events..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-[#2A3B4C] text-[#E0E0FF] border border-[#00FF85] p-3 rounded-lg focus:ring-2 focus:ring-[#00D9FF] placeholder-[#B0B0CC]"
          />
          <Link
            to="/createEvent"
            className="mt-4 inline-flex items-center px-5 py-2 rounded-lg bg-[#00FF85] text-[#0A1F44] font-semibold shadow-[0_0_8px_rgba(0,255,133,0.5)] hover:bg-[#00D9FF] transition-colors duration-200"
          >
            + Create Event
          </Link>
        </div>
      </div>

      {/* Mobile Hamburger */}
      <button
        className="md:hidden p-4 text-[#00FF85] fixed top-4 left-4 z-30"
        onClick={() => setSidebarOpen(!sidebarOpen)}
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          {sidebarOpen ? (
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M6 18L18 6M6 6l12 12"
            />
          ) : (
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M4 6h16M4 12h16M4 18h16"
            />
          )}
        </svg>
      </button>

      {/* Main Content */}
      <div className="flex-1 p-8">
        <div className="mb-8 text-center">
          <h1 className="text-4xl text-[#E0E0FF] drop-shadow-[2px_2px_6px_rgba(0,255,133,0.7)] font-bold">
            Manage My Events
          </h1>
          <p className="text-[#B0B0CC] text-lg font-semibold mt-2">
            Curate and control your epic occasions
          </p>
        </div>

        {error && (
          <div className="text-center py-8 bg-[#1A2B3C] rounded-lg shadow-[0_0_8px_rgba(255,77,77,0.5)] border border-[#FF4D4D] mb-8">
            <p className="text-[#E0E0FF] text-lg">{error}</p>
          </div>
        )}

        {filteredEvents.length === 0 ? (
          <div className="text-center py-16 bg-[#1A2B3C] rounded-lg shadow-[0_0_10px_rgba(0,255,133,0.5)] border border-[#00FF85]">
            <h3 className="text-xl font-semibold text-[#E0E0FF] mb-2">
              {searchTerm ? "No events found" : "No events yet"}
            </h3>
            <p className="text-[#B0B0CC] mb-6">
              {searchTerm
                ? "Try adjusting your search criteria."
                : "Create your first event to get started!"}
            </p>
            <Link
              to="/createEvent"
              className="inline-flex items-center px-5 py-2 rounded-lg bg-[#00FF85] text-[#0A1F44] font-semibold shadow-[0_0_8px_rgba(0,255,133,0.5)] hover:bg-[#00D9FF] animate-pulse transition-colors duration-200"
            >
              + Create Event
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {filteredEvents.map((event) => (
              <div
                key={event._id}
                className="relative bg-[#1A2B3C] border border-[#00FF85] rounded-lg shadow-[0_0_10px_rgba(0,255,133,0.3)] transform-style-preserve-3d transition-transform duration-500 hover:rotate-y-180"
                style={{ perspective: "1000px" }}
              >
                <div className="absolute inset-0 p-6 flex flex-col justify-between backface-hidden">
                  <div>
                    <h2 className="text-lg text-[#E0E0FF] font-bold">{event.title}</h2>
                    <p className="text-[#B0B0CC] text-sm mt-2">{event.description}</p>
                    <p className="mt-2 text-sm text-[#B0B0CC]">
                      <span className="inline-block transform hover:scale-110 transition-transform">📅</span> {event.date} at {event.time}
                    </p>
                    <p className="text-sm text-[#B0B0CC]">
                      <span className="inline-block transform hover:scale-110 transition-transform">📍</span> {event.location}
                    </p>
                    <p className="mt-2 text-sm font-bold text-[#00FF85]">
                      <span className="inline-block transform hover:scale-110 transition-transform">💵</span> KES {event.price}
                    </p>
                  </div>
                </div>
                <div className="absolute inset-0 p-6 flex flex-col justify-center items-center backface-hidden rotate-y-180 bg-[#2A3B4C]">
                  <Link
                    to={`/EditEvent/${event._id}`}
                    className="mb-3 w-full px-4 py-2 border border-[#00FF85] rounded-lg text-[#E0E0FF] text-center hover:bg-[#00D9FF] hover:text-[#0A1F44] transition-colors duration-200"
                  >
                    Edit
                  </Link>
                  <button
                    onClick={() => handleDeleteEvent(event._id)}
                    disabled={deletingId === event._id}
                    className="w-full px-4 py-2 border border-[#FF4D4D] rounded-lg text-[#FF4D4D] hover:bg-[#FF4D4D] hover:text-[#E0E0FF] transition-colors duration-200"
                  >
                    {deletingId === event._id ? "Deleting..." : "Delete"}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      <style jsx>{`
        .transform-style-preserve-3d {
          transform-style: preserve-3d;
        }
        .backface-hidden {
          backface-visibility: hidden;
        }
        .rotate-y-180 {
          transform: rotateY(180deg);
        }
        @keyframes slideIn {
          from {
            transform: translateX(-100%);
          }
          to {
            transform: translateX(0);
          }
        }
        .animate-slideIn {
          animation: slideIn 0.3s ease-out;
        }
      `}</style>
    </div>
  );
};

export default ManageEvents;
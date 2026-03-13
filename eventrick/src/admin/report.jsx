import React, { useEffect, useState } from "react";

const StatCard = ({ title, value, icon, color }) => (
  <div className="bg-[#1E1E1E] border border-[#FF4C4C] p-6 rounded-lg shadow-[0_0_8px_rgba(255,76,76,0.5)] transition-transform duration-300 hover:scale-105 hover:-rotate-2">
    <div className="flex items-center justify-between mb-3">
      <h3 className="text-lg font-extrabold text-[#F5F5F5]">{title}</h3>
      <div className="p-2 rounded-full bg-[#2A2A2A] border border-[#FF4C4C] transform hover:scale-110 transition-transform">{icon}</div>
    </div>
    <div className={`text-xl font-bold ${color}`}>{value}</div>
  </div>
);

const Report = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedPeriod, setSelectedPeriod] = useState("all");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch("http://localhost:4000/api/events")
      .then((res) => res.json())
      .then((data) => {
        console.log("Events API response:", data);
        setEvents(Array.isArray(data) ? data : data.events || []);
        setError(null);
      })
      .catch((err) => {
        console.error("Failed to fetch events:", err);
        setEvents([]);
        setError("Failed to load events. Please try again later.");
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[#121212]">
        <div className="w-12 h-12 border-4 border-t-[#FF4C4C] border-[#1E1E1E] rounded-full animate-spin"></div>
      </div>
    );
  }

  const safeEvents = Array.isArray(events) ? events : [];

  const now = new Date();
  const filteredEvents = safeEvents.filter((ev) => {
    if (!ev.date) return true;
    const eventDate = new Date(ev.date);

    if (selectedPeriod === "7d") {
      return eventDate >= new Date(now.setDate(now.getDate() - 7));
    }
    if (selectedPeriod === "30d") {
      return eventDate >= new Date(now.setDate(now.getDate() - 30));
    }
    return true;
  });

  const totalEvents = filteredEvents.length;
  const totalTicketsSold = filteredEvents.reduce(
    (sum, ev) => sum + (ev.soldTickets || 0),
    0
  );
  const totalRevenue = filteredEvents.reduce(
    (sum, ev) => sum + ((ev.soldTickets || 0) * (ev.price || 0)),
    0
  );

  const revenueByEvent = filteredEvents.map((ev) => ({
    eventId: ev._id,
    eventTitle: ev.title,
    ticketsSold: ev.soldTickets || 0,
    revenue: (ev.soldTickets || 0) * (ev.price || 0),
  }));

  const revenueByCategory = Object.values(
    filteredEvents.reduce((acc, ev) => {
      const cat = ev.category || "Uncategorized";
      if (!acc[cat]) {
        acc[cat] = { category: cat, ticketsSold: 0, revenue: 0 };
      }
      acc[cat].ticketsSold += ev.soldTickets || 0;
      acc[cat].revenue += (ev.soldTickets || 0) * (ev.price || 0);
      return acc;
    }, {})
  );

  const formatCurrency = (num) => `KES ${Number(num || 0).toLocaleString()}`;

  return (
    <div className="min-h-screen bg-[#121212] font-['Orbitron','Roboto',sans-serif] flex flex-col md:flex-row">
      {/* Sidebar */}
      <div
        className={`fixed inset-y-0 left-0 w-64 bg-[#1E1E1E] border-r border-[#FF4C4C] transform ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        } md:translate-x-0 transition-transform duration-300 z-20 md:sticky md:top-0`}
      >
        <div className="p-6">
          <h2 className="text-xl text-[#F5F5F5] font-bold mb-6">Analytics Filters</h2>
          <select
            value={selectedPeriod}
            onChange={(e) => setSelectedPeriod(e.target.value)}
            className="w-full bg-[#2A2A2A] text-[#F5F5F5] border border-[#FF4C4C] px-3 py-2 rounded-lg focus:ring-2 focus:ring-[#00D9FF]"
          >
            <option value="all">All Time</option>
            <option value="30d">Last 30 Days</option>
            <option value="7d">Last 7 Days</option>
          </select>
        </div>
      </div>

      {/* Mobile Hamburger */}
      <button
        className="md:hidden p-4 text-[#FF4C4C] fixed top-4 left-4 z-30"
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
          <h1 className="text-4xl text-[#F5F5F5] drop-shadow-[2px_2px_6px_rgba(255,76,76,0.7)] font-bold">
            Event Analytics Hub
          </h1>
          <p className="text-[#B0B0B0] text-lg font-semibold mt-2">
            Track performance for your epic occasions
          </p>
        </div>

        {error && (
          <div className="text-center py-8 bg-[#1E1E1E] rounded-lg shadow-[0_0_8px_rgba(255,76,76,0.5)] border border-[#FF4C4C] mb-8">
            <p className="text-[#F5F5F5] text-lg">{error}</p>
          </div>
        )}

        <div className="flex flex-wrap gap-4 mb-8 justify-center">
          <StatCard
            title="Total Revenue"
            value={formatCurrency(totalRevenue)}
            color="text-[#00CC66]"
            icon={<span>💰</span>}
          />
          <StatCard
            title="Tickets Sold"
            value={totalTicketsSold}
            color="text-[#3399FF]"
            icon={<span>🎟️</span>}
          />
          <StatCard
            title="Total Events"
            value={totalEvents}
            color="text-[#FF4C4C]"
            icon={<span>📅</span>}
          />
          <StatCard
            title="Avg. Revenue/Event"
            value={formatCurrency(totalEvents > 0 ? totalRevenue / totalEvents : 0)}
            color="text-[#FF4C4C]"
            icon={<span>📈</span>}
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div>
            <h3 className="text-2xl text-[#F5F5F5] font-bold mb-4">Revenue by Event</h3>
            <p className="text-[#B0B0B0] text-sm mb-4">Top performing occasions by revenue</p>
            {revenueByEvent.length === 0 ? (
              <div className="text-center py-8 bg-[#1E1E1E] rounded-lg shadow-[0_0_8px_rgba(255,76,76,0.5)] border border-[#FF4C4C]">
                <p className="text-[#B0B0B0] text-lg">No event data available</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {revenueByEvent
                  .sort((a, b) => b.revenue - a.revenue)
                  .slice(0, 10)
                  .map((event) => (
                    <div
                      key={event.eventId}
                      className="bg-[#1E1E1E] border border-[#FF4C4C] p-4 rounded-lg shadow-[0_0_8px_rgba(255,76,76,0.3)] transition-transform duration-200 hover:scale-105"
                    >
                      <p className="text-sm font-medium text-[#F5F5F5]">{event.eventTitle}</p>
                      <p className="text-xs text-[#B0B0B0]">{event.ticketsSold} tickets sold</p>
                      <p className="text-sm font-bold text-[#00CC66] mt-2">{formatCurrency(event.revenue)}</p>
                    </div>
                  ))}
              </div>
            )}
          </div>

          <div>
            <h3 className="text-2xl text-[#F5F5F5] font-bold mb-4">Revenue by Category</h3>
            <p className="text-[#B0B0B0] text-sm mb-4">Performance breakdown by category</p>
            {revenueByCategory.length === 0 ? (
              <div className="text-center py-8 bg-[#1E1E1E] rounded-lg shadow-[0_0_8px_rgba(255,76,76,0.5)] border border-[#FF4C4C]">
                <p className="text-[#B0B0B0] text-lg">No category data available</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {revenueByCategory.map((cat) => (
                  <div
                    key={cat.category}
                    className="bg-[#1E1E1E] border border-[#FF4C4C] p-4 rounded-lg shadow-[0_0_8px_rgba(255,76,76,0.3)] transition-transform duration-200 hover:scale-105"
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <span className="inline-block px-2 py-1 text-xs rounded-md bg-[#FF4C4C] text-[#F5F5F5] mr-2">{cat.category}</span>
                        <span className="text-xs text-[#B0B0B0]">{cat.ticketsSold} tickets</span>
                      </div>
                      <p className="text-sm font-bold text-[#00CC66]">{formatCurrency(cat.revenue)}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
      <style jsx>{`
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

export default Report;
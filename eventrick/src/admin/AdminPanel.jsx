import React, { useEffect, useState } from "react";

const AdminPanel = () => {
  const [activeTab, setActiveTab] = useState("users");
  const [searchTerm, setSearchTerm] = useState("");
  const [events, setEvents] = useState([]);
  const [users, setUsers] = useState([]);
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const fetchWithAuth = async (url, options = {}) => {
    const token = localStorage.getItem("token");
    const headers = {
      "Content-Type": "application/json",
      ...options.headers,
      Authorization: `Bearer ${token}`,
    };
    return fetch(url, { ...options, headers });
  };

  const fetchEvents = async () => {
    try {
      const res = await fetchWithAuth("http://localhost:4000/api/events");
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to fetch events");
      setEvents(data.events || []);
    } catch (err) {
      console.error("Error fetching events:", err);
    } finally {
      setLoading(false);
    }
  };

  const fetchUsers = async () => {
    try {
      const res = await fetchWithAuth("http://localhost:4000/api/users");
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to fetch users");
      setUsers(data.users || []);
    } catch (err) {
      console.error("Error fetching users:", err);
    } finally {
      setLoading(false);
    }
  };

  const fetchTickets = async () => {
    try {
      const res = await fetchWithAuth("http://localhost:4000/api/tickets");
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to fetch tickets");
      setTickets(data.tickets || []);
    } catch (err) {
      console.error("Error fetching tickets:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setLoading(true);
    if (activeTab === "events") fetchEvents();
    if (activeTab === "users") fetchUsers();
    if (activeTab === "tickets") fetchTickets();
  }, [activeTab]);

  const formatCurrency = (amount) =>
    new Intl.NumberFormat("en-KE", {
      style: "currency",
      currency: "KES",
    }).format(amount);

  const formatDate = (dateString) =>
    new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });

  const filteredUsers = users.filter(
    (u) =>
      (u.name && u.name.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (u.email && u.email.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const filteredEvents = events.filter(
    (ev) =>
      (ev.title && ev.title.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (ev.description &&
        ev.description.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const totalRevenue = tickets.reduce((sum, t) => {
    const event = events.find((e) => e._id === t.eventId);
    return sum + (event ? Number(event.price) : 0);
  }, 0);

  const handleRoleChange = async (userId, newRole) => {
    try {
      const res = await fetchWithAuth(
        `http://localhost:4000/api/users/${userId}`,
        {
          method: "PUT",
          body: JSON.stringify({ role: newRole }),
        }
      );

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || "Failed to update role");
      }

      setUsers((prev) =>
        prev.map((u) => (u._id === userId ? { ...u, role: newRole } : u))
      );
    } catch (err) {
      console.error("Error updating role:", err);
      alert("Failed to update role. Check backend logs.");
    }
  };

  const handleUserDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this user?")) return;
    try {
      await fetchWithAuth(`http://localhost:4000/api/users/${id}`, {
        method: "DELETE",
      });
      setUsers(users.filter((u) => u._id !== id));
    } catch (err) {
      console.error("Error deleting user:", err);
    }
  };

  const handleEventDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this event?")) return;
    try {
      await fetchWithAuth(`http://localhost:4000/api/events/${id}`, {
        method: "DELETE",
      });
      setEvents(events.filter((ev) => ev._id !== id));
    } catch (err) {
      console.error("Error deleting event:", err);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[#0A3D62]">
        <div className="w-12 h-12 border-4 border-t-[#FF6D00] border-[#1C2526] rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0A3D62] font-['Orbitron','Roboto',sans-serif] flex flex-col md:flex-row">
      {/* Sidebar */}
      <div
        className={`fixed inset-y-0 left-0 w-64 bg-[#1C2526] border-r border-[#FF6D00] transform ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        } md:translate-x-0 transition-transform duration-300 z-20 md:sticky md:top-0`}
      >
        <div className="p-6">
          <h2 className="text-xl text-[#FFE66D] font-bold mb-6">Navigation</h2>
          <nav className="flex flex-col space-y-4">
            {["users", "occasions", "tickets"].map((tab) => (
              <button
                key={tab}
                onClick={() => {
                  setActiveTab(tab === "occasions" ? "events" : tab);
                  setSidebarOpen(false);
                }}
                className={`text-left py-2 px-4 rounded-lg transition-all duration-300 ${
                  activeTab === (tab === "occasions" ? "events" : tab)
                    ? "bg-[#FF6D00] text-[#FFFFFF] shadow-[0_0_8px_rgba(255,109,0,0.5)]"
                    : "text-[#FFFFFF] hover:bg-[#2E3B3E] hover:text-[#00D9FF]"
                }`}
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </button>
            ))}
          </nav>
        </div>
      </div>

      {/* Mobile Hamburger */}
      <button
        className="md:hidden p-4 text-[#FF6D00] fixed top-4 left-4 z-30"
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
      <div className="flex-1 p-6 md:p-8">
        <div className="mb-8 text-center">
          <h1 className="text-4xl text-[#FFE66D] drop-shadow-[2px_2px_6px_rgba(255,109,0,0.7)] font-bold">
            My Events Admin Hub
          </h1>
          <p className="text-[#FFFFFF] text-lg font-semibold mt-2">
            Control users, occasions, and analytics
          </p>
        </div>

        <div className="flex flex-wrap gap-4 mb-8 justify-center">
          {[
            { label: "Total Users", value: users.length, color: "text-[#FFE66D]" },
            { label: "Total Occasions", value: events.length, color: "text-[#FFE66D]" },
            { label: "Tickets Sold", value: tickets.length, color: "text-[#00D9FF]" },
            { label: "Total Revenue", value: formatCurrency(totalRevenue), color: "text-[#FF6D00]" },
          ].map((stat) => (
            <div
              key={stat.label}
              className="bg-[#1C2526] border border-[#FF6D00] p-4 rounded-lg shadow-[0_0_10px_rgba(255,109,0,0.5)] w-40 transition-transform duration-300 hover:scale-105 hover:-rotate-2"
            >
              <p className="text-sm text-[#FFFFFF]">{stat.label}</p>
              <p className={`text-xl font-bold ${stat.color}`}>{stat.value}</p>
            </div>
          ))}
        </div>

        {activeTab === "users" && (
          <section>
            <div className="mb-6">
              <h2 className="text-2xl text-[#FFE66D] font-semibold mb-4">User Management</h2>
              <input
                type="text"
                placeholder="Search users..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="bg-[#1C2526] text-[#FFFFFF] border border-[#FF6D00] p-3 rounded-lg focus:ring-2 focus:ring-[#00D9FF] placeholder-[#FFFFFF] w-full max-w-md"
              />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredUsers.map((u) => (
                <div
                  key={u._id}
                  className="bg-[#1C2526] border border-[#FF6D00] p-4 rounded-lg shadow-[0_0_8px_rgba(255,109,0,0.3)] transition-transform duration-200 hover:scale-105 hover:-rotate-2"
                >
                  <p className="text-[#FFFFFF] font-semibold">{u.name}</p>
                  <p className="text-[#FFFFFF] text-sm">{u.email}</p>
                  <p className="text-[#FFE66D] text-sm">Role: {u.role}</p>
                  <div className="flex space-x-3 mt-3">
                    <select
                      value={u.role}
                      onChange={(e) => handleRoleChange(u._id, e.target.value)}
                      className="bg-[#2E3B3E] text-[#FFFFFF] border border-[#FF6D00] px-3 py-1 rounded-lg focus:ring-2 focus:ring-[#00D9FF]"
                    >
                      <option value="customer">Customer</option>
                      <option value="employee">Employee</option>
                      <option value="admin">Admin</option>
                    </select>
                    <button
                      onClick={() => handleUserDelete(u._id)}
                      className="px-4 py-1 bg-[#FF6D00] hover:bg-[#00D9FF] text-[#FFFFFF] rounded-lg transition-colors duration-200"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {activeTab === "events" && (
          <section>
            <div className="mb-6">
              <h2 className="text-2xl text-[#FFE66D] font-semibold mb-4">Event Management</h2>
              <input
                type="text"
                placeholder="Search events..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="bg-[#1C2526] text-[#FFFFFF] border border-[#FF6D00] p-3 rounded-lg focus:ring-2 focus:ring-[#00D9FF] placeholder-[#FFFFFF] w-full max-w-md"
              />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredEvents.map((ev) => (
                <div
                  key={ev._id}
                  className="bg-[#1C2526] border border-[#FF6D00] p-4 rounded-lg shadow-[0_0_8px_rgba(255,109,0,0.3)] transition-transform duration-200 hover:scale-105 hover:-rotate-2"
                >
                  <p className="text-[#FFFFFF] font-semibold">{ev.title}</p>
                  <p className="text-[#FFFFFF] text-sm">Category: {ev.category}</p>
                  <p className="text-[#FFFFFF] text-sm">Date: {formatDate(ev.date)}</p>
                  <p className="text-[#FFE66D] text-sm">Price: {formatCurrency(ev.price)}</p>
                  <button
                    onClick={() => handleEventDelete(ev._id)}
                    className="mt-3 px-4 py-1 bg-[#FF6D00] hover:bg-[#00D9FF] text-[#FFFFFF] rounded-lg transition-colors duration-200"
                  >
                    Delete
                  </button>
                </div>
              ))}
            </div>
          </section>
        )}

        {activeTab === "tickets" && (
          <section>
            <h2 className="text-2xl text-[#FFE66D] font-semibold mb-6">Ticket Management</h2>
            <div className="overflow-x-auto bg-[#1C2526] shadow-[0_0_10px_rgba(255,109,0,0.3)] rounded-xl">
              <table className="min-w-full text-left text-[#FFFFFF]">
                <thead className="bg-[#2E3B3E] text-[#FFE66D] font-bold">
                  <tr>
                    <th className="p-4">Ticket Code</th>
                    <th className="p-4">Event</th>
                    <th className="p-4">User</th>
                    <th className="p-4">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {tickets.map((t, i) => (
                    <tr
                      key={t._id}
                      className={`border-t border-[#FF6D00] ${
                        i % 2 === 0 ? "bg-[#1C2526]" : "bg-[#2E3B3E]"
                      } hover:bg-[#0A3D62] hover:shadow-[0_0_8px_rgba(0,217,255,0.5)] transition-all duration-200`}
                    >
                      <td className="p-4 font-mono">{t.ticketCode || "—"}</td>
                      <td className="p-4">{t.eventId?.title || "Unknown"}</td>
                      <td className="p-4">{t.userId?.email || "Unknown"}</td>
                      <td className="p-4">{t.paymentStatus || "—"}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        )}
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

export default AdminPanel;
import React, { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";

const categories = [
  "Technology",
  "Music",
  "Business",
  "Sports",
  "Art",
  "Food",
  "Education",
];

const EditEvent = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    title: "",
    organizer: "",
    description: "",
    date: "",
    time: "",
    category: "",
    location: "",
    price: "",
    maxTickets: "",
    imageUrl: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        setLoading(true);
        const res = await fetch(`http://localhost:4000/api/events/${id}`);
        if (!res.ok) {
          throw new Error(`Failed to fetch event: ${res.statusText}`);
        }
        const data = await res.json();
        const eventData = data.event || data;

        // Ensure date and time are properly formatted
        const eventDate = eventData.date ? new Date(eventData.date) : null;
        const formattedDate = eventDate ? eventDate.toISOString().split('T')[0] : '';
        const formattedTime = eventData.time ? eventData.time.substring(0, 5) : '';

        setFormData({
          title: eventData.title || "",
          organizer: eventData.organizer || "",
          description: eventData.description || "",
          date: formattedDate,
          time: formattedTime,
          category: eventData.category || "",
          location: eventData.location || "",
          price: eventData.price ? eventData.price.toString() : "",
          maxTickets: eventData.maxTickets ? eventData.maxTickets.toString() : "",
          imageUrl: eventData.imageUrl || "",
        });
      } catch (err) {
        console.error("Error fetching event:", err);
        setError(err.message || "Failed to load event details.");
      } finally {
        setLoading(false);
      }
    };
    fetchEvent();
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    // Basic form validation
    if (formData.price < 0 || formData.maxTickets < 0) {
      setError("Price and maximum tickets must be non-negative.");
      setLoading(false);
      return;
    }

    try {
      const res = await fetch(`http://localhost:4000/api/events/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          price: parseFloat(formData.price) || 0,
          maxTickets: parseInt(formData.maxTickets) || 0,
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.message || "Could not update event.");
      }

      setSuccess("Event updated successfully!");
      setTimeout(() => navigate("/manageEvents"), 1500);
    } catch (err) {
      console.error("Error updating event:", err);
      setError(err.message || "Failed to update event.");
    } finally {
      setLoading(false);
    }
  };

  const getFullImageUrl = (path) => {
    if (!path) return '';
    if (path.match(/^https?:\/\//) || path.startsWith('//')) {
      return path;
    }
    return `http://localhost:4000${path.startsWith('/') ? path : `/${path}`}`;
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8">
        <div>
          <h1 className="text-5xl text-white drop-shadow-[2px_2px_4px_rgba(128,0,128,0.7)] leading-tight font-bold">
            Edit Event
          </h1>
          <p className="text-white text-2xl font-bold">Update your event details below</p>
        </div>
        <Link
          to="/manageEvents"
          className="inline-flex items-center px-4 py-2 rounded-md bg-purple-900 hover:bg-purple-950 text-white text-sm font-medium transition-colors"
          aria-label="Back to events management"
        >
          ← Back to Events
        </Link>
      </div>

      {loading && (
        <p className="text-center text-gray-400 mb-4">Loading event details...</p>
      )}
      {error && (
        <p className="text-red-600 mb-4 border border-red-300 p-2 rounded bg-red-50">
          {error}
        </p>
      )}
      {success && (
        <p className="text-green-600 mb-4 border border-green-300 p-2 rounded bg-green-50">
          {success}
        </p>
      )}

      <form
        onSubmit={handleSubmit}
        className="bg-gray-900 p-6 rounded-lg shadow-md space-y-6 max-w-3xl mx-auto text-gray-400 font-bold"
        noValidate
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="title" className="block text-sm font-extrabold text-white">
              Event Title
            </label>
            <input
              id="title"
              name="title"
              type="text"
              value={formData.title}
              onChange={handleChange}
              required
              className="mt-1 block w-full px-3 py-2 border rounded-md focus:outline-none focus:ring focus:ring-blue-600 text-gray-800"
              disabled={loading}
            />
          </div>
          <div>
            <label htmlFor="organizer" className="block text-sm font-extrabold text-white">
              Organizer
            </label>
            <input
              id="organizer"
              name="organizer"
              type="text"
              value={formData.organizer}
              onChange={handleChange}
              required
              className="mt-1 block w-full px-3 py-2 border rounded-md focus:outline-none focus:ring focus:ring-blue-600 text-gray-800"
              disabled={loading}
            />
          </div>
        </div>

        <div>
          <label htmlFor="description" className="block text-sm font-extrabold text-white">
            Description
          </label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            rows={4}
            required
            className="mt-1 block w-full px-3 py-2 border rounded-md focus:outline-none focus:ring focus:ring-blue-600 text-gray-800"
            disabled={loading}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label htmlFor="date" className="block text-sm font-extrabold text-white">
              Date
            </label>
            <input
              id="date"
              name="date"
              type="date"
              value={formData.date}
              onChange={handleChange}
              required
              className="mt-1 block w-full px-3 py-2 border rounded-md focus:outline-none focus:ring focus:ring-blue-600 text-gray-800"
              disabled={loading}
            />
          </div>
          <div>
            <label htmlFor="time" className="block text-sm font-extrabold text-white">
              Time
            </label>
            <input
              id="time"
              name="time"
              type="time"
              value={formData.time}
              onChange={handleChange}
              required
              className="mt-1 block w-full px-3 py-2 border rounded-md focus:outline-none focus:ring focus:ring-blue-600 text-gray-800"
              disabled={loading}
            />
          </div>
          <div>
            <label htmlFor="category" className="block text-sm font-extrabold text-white">
              Category
            </label>
            <select
              id="category"
              name="category"
              value={formData.category}
              onChange={handleChange}
              required
              className="mt-1 block w-full px-3 py-2 border rounded-md focus:outline-none focus:ring focus:ring-blue-600 text-gray-800"
              disabled={loading}
            >
              <option value="">Select category</option>
              {categories.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div>
          <label htmlFor="location" className="block text-sm font-extrabold text-white">
            Location
          </label>
          <input
            id="location"
            name="location"
            type="text"
            value={formData.location}
            onChange={handleChange}
            required
            className="mt-1 block w-full px-3 py-2 border rounded-md focus:outline-none focus:ring focus:ring-blue-600 text-gray-800"
            disabled={loading}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="price" className="block text-sm font-extrabold text-white">
              Price ($)
            </label>
            <input
              id="price"
              name="price"
              type="number"
              min="0"
              step="0.01"
              value={formData.price}
              onChange={handleChange}
              required
              className="mt-1 block w-full px-3 py-2 border rounded-md focus:outline-none focus:ring focus:ring-blue-600 text-gray-800"
              disabled={loading}
            />
          </div>
          <div>
            <label htmlFor="maxTickets" className="block text-sm font-extrabold text-white">
              Maximum Tickets
            </label>
            <input
              id="maxTickets"
              name="maxTickets"
              type="number"
              min="0"
              value={formData.maxTickets}
              onChange={handleChange}
              required
              className="mt-1 block w-full px-3 py-2 border rounded-md focus:outline-none focus:ring focus:ring-blue-600 text-gray-800"
              disabled={loading}
            />
          </div>
        </div>

        <div>
          <label htmlFor="imageUrl" className="block text-sm font-extrabold text-white">
            Image URL
          </label>
          <input
            id="imageUrl"
            name="imageUrl"
            type="url"
            value={formData.imageUrl}
            onChange={handleChange}
            className="mt-1 block w-full px-3 py-2 border rounded-md focus:outline-none focus:ring focus:ring-blue-600 text-gray-800"
            disabled={loading}
          />
          {formData.imageUrl && (
            <img
              src={getFullImageUrl(formData.imageUrl)}
              alt="Event preview"
              className="w-40 h-40 object-cover mt-2 border rounded"
              onError={(e) => {
                e.target.src = '/fallback-image.jpg'; // Fallback image
                e.target.alt = 'Image not available';
              }}
            />
          )}
        </div>

        <button
          type="submit"
          disabled={loading}
          className={`w-full px-4 py-2 rounded-md text-white font-medium transition-colors ${
            loading ? 'bg-purple-700 cursor-not-allowed' : 'bg-purple-900 hover:bg-purple-950'
          }`}
          aria-label={loading ? "Updating event" : "Update event"}
        >
          {loading ? "Updating..." : "Update Event"}
        </button>
      </form>
    </div>
  );
};

export default EditEvent;
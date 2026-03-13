import React, { useState } from "react";
import { Link } from "react-router-dom";

const CreateEvent = () => {
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

  const handleChange = (field, value) => {
    setFormData((prevData) => ({
      ...prevData,
      [field]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    try {
      const payload = {
        ...formData,
        imageUrl: formData.imageUrl.trim() || "/public/images/placeholder.jpg",
      };

      const res = await fetch("http://localhost:4000/api/events", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || " Could not create event.");

      setSuccess(" Event created successfully!");
      setFormData({
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
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8">
        <div>
          <h1 className="text-5xl font-bold text-white drop-shadow-[2px_2px_4px_rgba(128,0,128,0.7)] leading-tight">Create New Event</h1>
          <p className="text-gray-400 font-bold text-lg">Fill out the details below to publish your event</p>
        </div>
        <Link
          to="/manageEvents"
          className="inline-flex items-center px-4 py-2 rounded-md bg-purple-900 hover:bg-purple-950 text-white text-sm font-bold"
        >
          ← Back to Events
        </Link>
      </div>

      {error && <p className="text-red-600 mb-4">{error}</p>}
      {success && <p className="text-green-600 mb-4">{success}</p>}

      <form onSubmit={handleSubmit} className="bg-gray-900 p-6 rounded-lg shadow space-y-6 text-gray-400 font-bold">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input
            type="text"
            placeholder="Event Title"
            value={formData.title}
            onChange={(e) => handleChange("title", e.target.value)}
            required
            className="border rounded-md px-3 py-2 w-full"
          />
          <input
            type="text"
            placeholder="Organizer"
            value={formData.organizer}
            onChange={(e) => handleChange("organizer", e.target.value)}
            required
            className="border rounded-md px-3 py-2 w-full"
          />
        </div>

        <textarea
          placeholder="Description"
          value={formData.description}
          onChange={(e) => handleChange("description", e.target.value)}
          required
          className="border rounded-md px-3 py-2 w-full"
        />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <input
            type="date"
            value={formData.date}
            onChange={(e) => handleChange("date", e.target.value)}
            required
            className="border rounded-md px-3 py-2 w-full"
          />
          <input
            type="time"
            value={formData.time}
            onChange={(e) => handleChange("time", e.target.value)}
            required
            className="border rounded-md px-3 py-2 w-full"
          />
          <select
            value={formData.category}
            onChange={(e) => handleChange("category", e.target.value)}
            required
            className="border rounded-md px-3 py-2 w-full"
          >
            <option value="">Select category</option>
            <option value="Technology">Technology</option>
            <option value="Music">Music</option>
            <option value="Business">Business</option>
            <option value="Sports">Sports</option>
            <option value="Art">Art</option>
            <option value="Food">Food</option>
            <option value="Education">Education</option>
          </select>
        </div>

        <input
          type="text"
          placeholder="Location"
          value={formData.location}
          onChange={(e) => handleChange("location", e.target.value)}
          required
          className="border rounded-md px-3 py-2 w-full"
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input
            type="number"
            placeholder="Price"
            value={formData.price}
            onChange={(e) => handleChange("price", e.target.value)}
            required
            className="border rounded-md px-3 py-2 w-full"
          />
          <input
            type="number"
            placeholder="Max Tickets"
            value={formData.maxTickets}
            onChange={(e) => handleChange("maxTickets", e.target.value)}
            required
            className="border rounded-md px-3 py-2 w-full"
          />
        </div>

        <input
          type="text"
          placeholder="/public/images/example.jpg"
          value={formData.imageUrl}
          onChange={(e) => handleChange("imageUrl", e.target.value)}
          className="border rounded-md px-3 py-2 w-full"
        />
        {formData.imageUrl && (
          <img
            src={`http://localhost:4000${formData.imageUrl}`}
            alt="Preview"
            className="w-40 h-40 object-cover mt-2 border rounded"
            onError={(e) => (e.target.style.display = "none")}
          />
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
        >
          {loading ? "Creating..." : "Create Event"}
        </button>
      </form>
    </div>
  );
};

export default CreateEvent;

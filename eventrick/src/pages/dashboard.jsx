import React from "react";
import PropTypes from "prop-types";

const EventCard = ({ event, onBuy }) => {
  const { _id, title, description, date, time, location, price, availableTickets, imageUrl } = event;

  const formatDate = (dateString) =>
    new Date(dateString).toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });

  const formatPrice = (p) =>
    new Intl.NumberFormat("en-US", { style: "currency", currency: "KES" }).format(p);

  return (
    <div className="event-card bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300">
      <img
        src={`http://localhost:4000${imageUrl}`}
        alt={title}
        className="w-full h-64 object-cover"
        onError={(e) => {
          e.target.src = "https://placehold.co/400x300?text=Event+Image";
        }}
      />
      <div className="p-6">
        <h3 className="text-2xl font-bold mb-3">{title}</h3>
        <p className="text-gray-600 mb-4">{description}</p>
        <p>
          {formatDate(date)} {time ? `at ${time}` : ""}
        </p>
        <p>{location}</p>
        <p className="text-green-600 font-semibold">{formatPrice(price)}</p>
        <p>{availableTickets} tickets available</p>
        <button
          onClick={() => onBuy(event)}
          className="w-full bg-purple-900 text-white py-3 rounded-lg font-semibold hover:bg-purple-950 mt-3"
        >
          Get Tickets
        </button>
      </div>
    </div>
  );
};

EventCard.propTypes = {
  event: PropTypes.object.isRequired,
  onBuy: PropTypes.func.isRequired,
};

export default EventCard;

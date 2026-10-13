import React, { useState } from "react";

function TicketPurchase({ eventId }) {
  const [phone, setPhone] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  if (!eventId) {
    return <p className="text-red-600">Missing event ID.</p>;
  }

  const API_BASE_URL = "  https://7d56-197-232-120-220.ngrok-free.app";

  console.log("API URL:", API_BASE_URL);

  const handlePurchase = async () => {
    setLoading(true);
    setMessage("");

    let cleanPhone = phone.trim();

    if (cleanPhone.startsWith("0")) {
      cleanPhone = "254" + cleanPhone.substring(1);
    }

    if (!/^254\d{9}$/.test(cleanPhone)) {
      setMessage("❌ Invalid phone number. Example: 254712345678");
      setLoading(false);
      return;
    }

    const payload = {
      eventId,
      ticketQuantity: Number(quantity),
      phoneNumber: cleanPhone,
    };

    try {
      const token = localStorage.getItem("token");

      if (!token) {
        setMessage("❌ Please login first.");
        setLoading(false);
        return;
      }

      console.log("Sending request to:", `${API_BASE_URL}/api/payments/stkpush`);

      const res = await fetch(`${API_BASE_URL}/api/payments/stkpush`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      const data = await res.json().catch(() => ({}));

      console.log("Response:", data);

      if (res.status === 401) {
        setMessage("❌ Unauthorized. Please login again.");
      } else if (res.ok) {
        setMessage(
          data.CustomerMessage ||
            data.message ||
            "✅ STK Push initiated. Check your phone."
        );
      } else {
        setMessage(
          `❌ ${
            data.errorMessage ||
            data.message ||
            "Payment request failed."
          }`
        );
      }
    } catch (error) {
      console.error("Payment error:", error);
      setMessage("❌ Failed to connect to payment server.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-gray-900 p-6 rounded-2xl text-white w-96">
      <h2 className="text-lg font-semibold mb-4 text-purple-400">
        Ticket Purchase
      </h2>

      <label className="block mb-2">Phone Number:</label>
      <input
        type="text"
        placeholder="2547XXXXXXXX"
        value={phone}
        onChange={(e) => setPhone(e.target.value)}
        className="w-full p-2 mb-4 rounded text-black outline-none"
      />

      <label className="block mb-2">Quantity:</label>
      <input
        type="number"
        min="1"
        value={quantity}
        onChange={(e) => setQuantity(Number(e.target.value))}
        className="w-full p-2 mb-4 rounded text-black outline-none"
      />

      <button
        onClick={handlePurchase}
        disabled={loading}
        className={`w-full px-4 py-2 rounded font-semibold ${
          loading ? "bg-green-800 cursor-not-allowed" : "bg-green-600"
        }`}
      >
        {loading ? "Processing..." : `Buy ${quantity} Ticket(s)`}
      </button>

      {message && <p className="mt-4 text-sm">{message}</p>}
    </div>
  );
}

export default TicketPurchase;
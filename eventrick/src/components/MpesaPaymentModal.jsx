import React, { useState } from "react";

function TicketPurchase({ eventId }) {
  const [phone, setPhone] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  if (!eventId) {
    return <p className="text-red-600">Missing event ID.</p>;
  }

  const handlePurchase = async () => {
    setLoading(true);
    setMessage("");

    // Step 1: Clean and validate phone number
    let cleanPhone = phone.replace(/^=|\s+/g, ""); // remove '=' and spaces
    if (cleanPhone.startsWith("0")) {
      cleanPhone = "254" + cleanPhone.substring(1); // convert 07... → 2547...
    }
    if (!cleanPhone.startsWith("254")) {
      setMessage("Invalid phone number format. Use 2547XXXXXXXX.");
      setLoading(false);
      return;
    }

    const payload = {
      eventId,
      ticketQuantity: quantity,
      phoneNumber: cleanPhone,
    };

    try {
      const token = localStorage.getItem("token");

      const res = await fetch("http://localhost:4000/api/payments/stkpush", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      // Step 2: Handle response properly
      if (res.ok && data.ResponseCode === "0") {
        setMessage("✅ Payment initiated successfully. Check your phone.");
      } else {
        const errorMsg =
          data.errorMessage ||
          data.message ||
          "Payment failed. Check number or backend logs.";
        setMessage("❌ " + errorMsg);
      }
    } catch (err) {
      console.error("Payment error:", err);
      setMessage("⚠️ Something went wrong. Check console or backend.");
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

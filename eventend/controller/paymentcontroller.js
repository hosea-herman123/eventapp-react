// import axios from "axios";
// import mongoose from "mongoose";
// import createError from "http-errors";
// import Event from "../models/event.js";
// import Ticket from "../models/ticket.js";

// function getTimestamp() {
//   const d = new Date();
//   return (
//     d.getFullYear().toString() +
//     ("" + (d.getMonth() + 1)).padStart(2, "0") +
//     ("" + d.getDate()).padStart(2, "0") +
//     ("" + d.getHours()).padStart(2, "0") +
//     ("" + d.getMinutes()).padStart(2, "0") +
//     ("" + d.getSeconds()).padStart(2, "0")
//   );
// }

// async function getAccessToken() {
//   const auth = Buffer.from(
//     `${process.env.MPESA_CONSUMER_KEY}:${process.env.MPESA_CONSUMER_SECRET}`
//   ).toString("base64");

//   const url =
//     process.env.MPESA_ENV === "production"
//       ? "https://api.safaricom.co.ke/oauth/v1/generate?grant_type=client_credentials"
//       : "https://sandbox.safaricom.co.ke/oauth/v1/generate?grant_type=client_credentials";

//   const resp = await axios.get(url, {
//     headers: { Authorization: `Basic ${auth}` },
//   });

//   return resp.data.access_token;
// }

// async function initiateSTKPush(accessToken, body) {
//   const url =
//     process.env.MPESA_ENV === "production"
//       ? "https://api.safaricom.co.ke/mpesa/stkpush/v1/processrequest"
//       : "https://sandbox.safaricom.co.ke/mpesa/stkpush/v1/processrequest";

//   const resp = await axios.post(url, body, {
//     headers: { Authorization: `Bearer ${accessToken}` },
//   });

//   return resp.data;
// }

// const paymentController = {
//   initiatePayment: async (req, res, next) => {
//   try {
//     const userId = req.user?._id; 
//     if (req.payload?.aud) {
//       userId = req.payload.aud;
//     }

//     console.log("Incoming body:", req.body);

//     const { eventId, ticketQuantity, phoneNumber } = req.body;
//     if (!eventId || !ticketQuantity || !phoneNumber) {
//       return next(createError.BadRequest("Missing fields"));
//     }

//     let phone = phoneNumber.replace(/\s+/g, "");
//     if (phone.startsWith("+")) phone = phone.slice(1);
//     if (phone.startsWith("0")) phone = "254" + phone.slice(1);
//     if (!/^2547\d{8}$/.test(phone)) {
//       return next(createError.BadRequest("Phone must be Kenyan format"));
//     }

//     const event = await Event.findById(eventId);
//     if (!event) return next(createError.NotFound("Event not found"));
//     if (event.availableTickets < ticketQuantity) {
//       return next(createError.BadRequest("Insufficient tickets"));
//     }

//     const accessToken = await getAccessToken();
//     const timestamp = getTimestamp();
//     const password = Buffer.from(
//       process.env.MPESA_BUSINESS_SHORTCODE +
//         process.env.MPESA_PASSKEY +
//         timestamp
//     ).toString("base64");

//     const amount = event.price * ticketQuantity;

// function sanitizeForMpesa(str) {
//   return str.replace(/[^a-zA-Z0-9 ]/g, "").slice(0, 20); 
// }

// const safeTitle = sanitizeForMpesa(event.title);

// const stkBody = {
//   BusinessShortCode: process.env.MPESA_BUSINESS_SHORTCODE,
//   Password: password,
//   Timestamp: timestamp,
//   TransactionType: "CustomerPayBillOnline",
//   Amount: amount,
//   PartyA: phone,
//   PartyB: process.env.MPESA_BUSINESS_SHORTCODE,
//   PhoneNumber: phone,
//   CallBackURL: `${process.env.MPESA_CALLBACK_URL.replace(/\/$/, "")}/api/payments/callback`,
//   AccountReference: `evt-${eventId}`.slice(0, 20), 
//   TransactionDesc: `Tickets ${safeTitle}`, 
// };


//     console.log("Sending STK Push:", stkBody);
//     const darajaResp = await initiateSTKPush(accessToken, stkBody);
//     console.log("Daraja response:", darajaResp);

//     const checkoutId = darajaResp.CheckoutRequestID || `txn_${Date.now()}`;

//     const ticketDoc = {
//       userId: mongoose.isValidObjectId(userId) ? new mongoose.Types.ObjectId(userId) : null,
//       eventId: new mongoose.Types.ObjectId(eventId),
//       quantity: ticketQuantity,
//       ticketPrice: event.price,
//       totalPrice: amount,
//       transactionId: checkoutId,
//       status: "pending",
//       ticketCode: `TCKT-${Math.random().toString(36).substr(2, 9).toUpperCase()}`,
//     };

//     console.log("Creating ticket:", ticketDoc);

//     const ticket = new Ticket(ticketDoc);
//     await ticket.save();

//     res.json({
//       message: "STK Push initiated",
//       daraja: darajaResp,
//       ticketId: ticket._id,
//       transactionId: checkoutId,
//     });
//   } catch (err) {
//     console.error(" Payment error full:", err);
//     return res.status(500).json({
//       error: err.message,
//       stack: err.stack,
//       details: err.response?.data || null,
//     });
//   }
// },

// };

// export const mpesaCallback = async (req, res) => {
//   try {
//     console.log("Callback body:", req.body);

//     const { Body } = req.body;
//     const stkCallback = Body.stkCallback;

//     if (stkCallback.ResultCode === 0) {
//       const checkoutRequestId = stkCallback.CheckoutRequestID;
//       const mpesaReceipt = stkCallback.CallbackMetadata?.Item?.find(i => i.Name === "MpesaReceiptNumber")?.Value;

//       await Ticket.findOneAndUpdate(
//         { transactionId: checkoutRequestId },
//         { status: "confirmed", mpesaReceipt },
//         { new: true }
//       );
//     } else {
//       const checkoutRequestId = stkCallback.CheckoutRequestID;
//       await Ticket.findOneAndUpdate(
//         { transactionId: checkoutRequestId },
//         { status: "failed" },
//         { new: true }
//       );
//     }

//     res.json({ message: "Callback received" });
//   } catch (err) {
//     console.error("Callback error:", err);
//     res.status(500).json({ message: "Server error" });
//   }
// };

// export const getTicketByTransaction = async (req, res, next) => {
//   try {
//     const { transactionId } = req.params;
//     if (!transactionId) return res.status(400).json({ error: "transactionId required" });

//     const ticket = await Ticket.findOne({ transactionId }).populate(
//       "eventId userId",
//       "title email"
//     );
//     if (!ticket) return res.status(404).json({ error: "Ticket not found" });

//     res.json({ ticket });
//   } catch (err) {
//     next(err);
//   }
// };

// export default paymentController;
import axios from "axios";
import mongoose from "mongoose";
import createError from "http-errors";
import Event from "../models/event.js";
import Ticket from "../models/ticket.js";

class MpesaService {
  constructor() {
    // Sandbox hardcoded credentials (replace with your own .env values in production)
    this.consumerKey = "9D0ItoywgAVmZ6bJ7YQoCoO8Ix9WGuwYilFJUN753zGIBRmu";
    this.consumerSecret = "vSCYBmaPG8JLHpIUAt0QmG2qoLSxj2nuq3Rp1vdZRhbBOdjAT3zb31pVV8yZhlyU";
    this.businessShortCode = "174379";
    this.passkey =
      "bfb279f9aa9bdbcf158e97dd71a467cd2e0c893059b10f78e6b72ada1ed2c919";
    this.callbackUrl =
      "https://98e85cb43135.ngrok-free.app/api/payments/callback";
  }

  async getAccessToken() {
    const auth = Buffer.from(
      `${this.consumerKey}:${this.consumerSecret}`
    ).toString("base64");

    const response = await axios.get(
      "https://sandbox.safaricom.co.ke/oauth/v1/generate?grant_type=client_credentials",
      { headers: { Authorization: `Basic ${auth}` } }
    );

    return response.data.access_token;
  }

  async stkPush(phoneNumber, amount, accountRef = "EventBooking") {
    const token = await this.getAccessToken();
    const timestamp = new Date().toISOString().replace(/[-T:.Z]/g, "").slice(0, 14);

    const password = Buffer.from(
      this.businessShortCode + this.passkey + timestamp
    ).toString("base64");

    const data = {
      BusinessShortCode: this.businessShortCode,
      Password: password,
      Timestamp: timestamp,
      TransactionType: "CustomerPayBillOnline",
      Amount: amount,
      PartyA: phoneNumber,
      PartyB: this.businessShortCode,
      PhoneNumber: phoneNumber,
      CallBackURL: this.callbackUrl,
      AccountReference: accountRef,
      TransactionDesc: "Payment for Event",
    };

    const response = await axios.post(
      "https://sandbox.safaricom.co.ke/mpesa/stkpush/v1/processrequest",
      data,
      { headers: { Authorization: `Bearer ${token}` } }
    );

    return response.data;
  }
}

const mpesaService = new MpesaService();

function sanitizeForMpesa(str) {
  return str.replace(/[^a-zA-Z0-9 ]/g, "").slice(0, 20);
}

const paymentController = {
  initiatePayment: async (req, res, next) => {
    try {
      let userId = req.user?._id;
      if (req.payload?.aud) userId = req.payload.aud;

      const { eventId, ticketQuantity, phoneNumber } = req.body;
      if (!eventId || !ticketQuantity || !phoneNumber) {
        return next(createError.BadRequest("Missing fields"));
      }

      let phone = phoneNumber.replace(/\s+/g, "");
      if (phone.startsWith("+")) phone = phone.slice(1);
      if (phone.startsWith("0")) phone = "254" + phone.slice(1);
      if (!/^2547\d{8}$/.test(phone)) {
        return next(createError.BadRequest("Phone must be Kenyan format"));
      }

      const event = await Event.findById(eventId);
      if (!event) return next(createError.NotFound("Event not found"));
      if (event.availableTickets < ticketQuantity) {
        return next(createError.BadRequest("Insufficient tickets"));
      }

      const amount = event.price * ticketQuantity;
      const safeTitle = sanitizeForMpesa(event.title);

      console.log("Initiating STK Push for:", phone, amount, event.title);

      const darajaResp = await mpesaService.stkPush(
        phone,
        amount,
        `evt-${eventId}`.slice(0, 20)
      );

      console.log("Daraja Response:", darajaResp);

      const checkoutId = darajaResp.CheckoutRequestID || `txn_${Date.now()}`;

      const ticketDoc = {
        userId: mongoose.isValidObjectId(userId)
          ? new mongoose.Types.ObjectId(userId)
          : null,
        eventId: new mongoose.Types.ObjectId(eventId),
        quantity: ticketQuantity,
        ticketPrice: event.price,
        totalPrice: amount,
        transactionId: checkoutId,
        status: "pending",
        ticketCode: `TCKT-${Math.random().toString(36).substr(2, 9).toUpperCase()}`,
      };

      const ticket = new Ticket(ticketDoc);
      await ticket.save();

      res.json({
        message: "STK Push initiated",
        daraja: darajaResp,
        ticketId: ticket._id,
        transactionId: checkoutId,
      });
    } catch (err) {
      console.error("Payment error full:", err);
      return res.status(500).json({
        error: err.message,
        stack: err.stack,
        details: err.response?.data || null,
      });
    }
  },
};

export const mpesaCallback = async (req, res) => {
  try {
    console.log("Callback body:", req.body);
    const { Body } = req.body;
    const stkCallback = Body.stkCallback;

    const checkoutRequestId = stkCallback.CheckoutRequestID;
    if (stkCallback.ResultCode === 0) {
      const mpesaReceipt = stkCallback.CallbackMetadata?.Item?.find(
        (i) => i.Name === "MpesaReceiptNumber"
      )?.Value;

      await Ticket.findOneAndUpdate(
        { transactionId: checkoutRequestId },
        { status: "confirmed", mpesaReceipt },
        { new: true }
      );
    } else {
      await Ticket.findOneAndUpdate(
        { transactionId: checkoutRequestId },
        { status: "failed" },
        { new: true }
      );
    }

    res.json({ message: "Callback received" });
  } catch (err) {
    console.error("Callback error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

export const getTicketByTransaction = async (req, res, next) => {
  try {
    const { transactionId } = req.params;
    if (!transactionId)
      return res.status(400).json({ error: "transactionId required" });

    const ticket = await Ticket.findOne({ transactionId }).populate(
      "eventId userId",
      "title email"
    );
    if (!ticket) return res.status(404).json({ error: "Ticket not found" });

    res.json({ ticket });
  } catch (err) {
    next(err);
  }
};

export default paymentController;

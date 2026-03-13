import mongoose from 'mongoose';

const { Schema } = mongoose;

const ticketSchema = new Schema({
  eventId: { type: Schema.Types.ObjectId, ref: 'Event', required: true },
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  quantity: { type: Number, required: true },
  totalPrice: { type: Number, required: true },
  paymentStatus: { 
    type: String, 
    enum: ['pending', 'completed', 'failed', 'refunded'], 
    default: 'pending' 
  },
  ticketCode: { type: String, unique: true }, 
  mpesaReceiptNumber: { type: String },
  transactionId: { type: String },
  purchaseDate: { type: Date, default: Date.now }
});

const Ticket = mongoose.model('Ticket', ticketSchema);

export default Ticket;
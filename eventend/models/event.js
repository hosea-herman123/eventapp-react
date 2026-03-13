import mongoose from 'mongoose';

const { Schema } = mongoose;

const eventSchema = new Schema({
  title: { type: String, required: true },        
  description: { type: String, required: true },
  date: { type: String, required: true },         
  time: { type: String },                         
  location: { type: String, required: true },
  price: { type: Number, required: true },        
  availableTickets: { type: Number, required: true },
  category: { type: String },
  imageUrl: { type: String },
  createdAt: { type: Date, default: Date.now }
});

const Event = mongoose.model('Event', eventSchema);

export default Event;
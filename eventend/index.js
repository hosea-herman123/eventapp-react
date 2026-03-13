import express from 'express';
import useroutes from './routes/userrouter.js';
import eventroutes from './routes/eventrouter.js';
import paymentroutes from './routes/paymentrouter.js';
import ticketroutes from './routes/ticketrouter.js';
import dotenv from 'dotenv';
import './helpers/init_mongodb.js';
import cors from 'cors';
import path from "path";
import { fileURLToPath } from "url";

dotenv.config();

const app = express();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use("/public", express.static(path.join(__dirname, "public")));

app.use(express.json());
app.use(cors());

app.get('/', (req, res) => {
  res.send('Welcome to the Events and Tickets API!');
});

app.use('/api/users', useroutes);
app.use('/api/events', eventroutes);
app.use('/api/payments', paymentroutes);
app.use("/api/tickets", ticketroutes);

app.use((req, res, next) => {
  const err = new Error('Not Found');
  err.status = 404;
  next(err);
});

app.use((err, req, res, next) => {
  res.status(err.status || 500).send({
    error: { status: err.status || 500, message: err.message }
  });
});

app.listen(process.env.PORT || 4000, () => {
  console.log(`🚀 Now listening on: http://localhost:${process.env.PORT || 4000}`);
});

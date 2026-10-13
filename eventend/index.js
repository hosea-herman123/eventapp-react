import express from 'express';
import useroutes from './routes/userrouter.js';
import eventroutes from './routes/eventrouter.js';
import paymentroutes from './routes/paymentrouter.js';
import ticketroutes from './routes/ticketrouter.js';
import dotenv from 'dotenv';
import './helpers/init_mongodb.js';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';

dotenv.config();

const app = express();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ===============================
// CORS CONFIGURATION
// ===============================
app.use(
  cors({
    origin: [
      'http://localhost:5173',
      'http://127.0.0.1:5173',
      'https://eventapp-react.vercel.app',
    ],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  })
);

// ===============================
// MIDDLEWARE
// ===============================
app.use(express.json());

app.use(
  '/public',
  express.static(path.join(__dirname, 'public'))
);

// ===============================
// HOME ROUTE
// ===============================
app.get('/', (req, res) => {
  res.send('Welcome to the Events and Tickets API!');
});

// ===============================
// API ROUTES
// ===============================
app.use('/api/users', useroutes);
app.use('/api/events', eventroutes);
app.use('/api/payments', paymentroutes);
app.use('/api/tickets', ticketroutes);

// ===============================
// 404 HANDLER
// ===============================
app.use((req, res, next) => {
  const err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// ===============================
// ERROR HANDLER
// ===============================
app.use((err, req, res, next) => {
  res.status(err.status || 500).send({
    error: {
      status: err.status || 500,
      message: err.message,
    },
  });
});

// ===============================
// SERVER START
// ===============================
const PORT = process.env.PORT || 4000;

app.listen(PORT, () => {
  console.log('Server listening on port ' + PORT);
});
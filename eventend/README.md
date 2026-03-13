# Event Ticket Booking System with M-Pesa Integration

This is a Node.js/Express API for booking event tickets with M-Pesa payment integration.

## Features

- User registration and authentication
- Event management (CRUD operations)
- Ticket booking with M-Pesa STK Push payment
- Payment status tracking
- User ticket history

## Prerequisites

- Node.js v14 or higher
- MongoDB
- M-Pesa Daraja API credentials

## Installation

1. Clone the repository:
   ```
   git clone <repository-url>
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Set up environment variables in `.env`:
   ```
   PORT=4000
   MONGODB_URI=mongodb://localhost:27017/eventAPI
   DB_NAME=eventAPI
   ACCESS_TOKEN_SECRET=your_jwt_secret
   MPESA_CONSUMER_KEY=your_consumer_key
   MPESA_CONSUMER_SECRET=your_consumer_secret
   MPESA_BUSINESS_SHORTCODE=your_shortcode
   MPESA_PASSKEY=your_passkey
   MPESA_CALLBACK_URL=http://your-domain.com
   ```

4. Start the server:
   ```
   npm start
   ```

## API Endpoints

### User Management

- `POST /api/users/register` - Register a new user
- `POST /api/users/login` - User login
- `POST /api/users/forgot-password` - Request password reset
- `POST /api/users/reset-password` - Reset password
- `GET /api/users/tickets` - Get user's ticket history (requires authentication)

### Event Management

- `GET /api/events` - Get all events
- `GET /api/events/:id` - Get event by ID
- `POST /api/events` - Create a new event (admin only, requires authentication)
- `PUT /api/events/:id` - Update event (admin only, requires authentication)
- `DELETE /api/events/:id` - Delete event (admin only, requires authentication)

### Payment

- `POST /api/payments/initiate` - Initiate M-Pesa payment for ticket purchase (requires authentication)
- `POST /api/payments/callback` - M-Pesa callback endpoint

## M-Pesa Integration

### How it works

1. User selects an event and number of tickets
2. User provides their phone number
3. System initiates M-Pesa STK Push to user's phone
4. User enters their M-Pesa PIN to complete payment
5. M-Pesa sends callback to our system with payment status
6. System updates ticket status and event availability

### Required M-Pesa Credentials

- Consumer Key
- Consumer Secret
- Business Shortcode
- Passkey
- Callback URL

### Testing with M-Pesa Sandbox

To test with M-Pesa sandbox:

1. Register for a Safaricom Daraja account
2. Create a sandbox app
3. Get your consumer key and secret
4. Use the provided shortcode and passkey for testing

## Database Schema

### User
- email (String, required, unique)
- password (String, required)
- role (String, enum: admin, customer, employee)

### Event
- name (String, required)
- description (String, required)
- date (Date, required)
- location (String, required)
- ticketPrice (Number, required)
- totalTickets (Number, required)
- availableTickets (Number, required)
- imageUrl (String)

### Ticket
- eventId (ObjectId, ref: Event)
- userId (ObjectId, ref: User)
- quantity (Number, required)
- totalPrice (Number, required)
- paymentStatus (String, enum: pending, completed, failed, refunded)
- mpesaReceiptNumber (String)
- transactionId (String)
- purchaseDate (Date)

## Error Handling

All endpoints return appropriate HTTP status codes and error messages:

- 200: Success
- 201: Created
- 400: Bad Request
- 401: Unauthorized
- 403: Forbidden
- 404: Not Found
- 500: Internal Server Error

## Security

- JWT tokens for authentication
- Password hashing with bcrypt
- Input validation with Joi
- Role-based access control

## Testing

You can test the API using the provided test script or with tools like Postman.

To run the test script:
```
node test-api.js
```

Then use the endpoints:
- `POST http://localhost:3000/test-purchase` - Simulate ticket purchase
- `GET http://localhost:3000/test-user-tickets` - Get user tickets
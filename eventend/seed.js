// seed.js - Run this once to seed admin user
import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

// Connect to MongoDB (update with your MongoDB URI)
await mongoose.connect('mongodb://localhost:27017/eventAPI', {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

// User schema (adjust to match your actual User model)
const UserSchema = new mongoose.Schema({
  name: String,
  email: String,
  password: String,
  role: {
    type: String,
    enum: ['customer', 'admin', 'employee'],
    default: 'customer'
  }
});

const User = mongoose.model('User', UserSchema);

// Seed admin function
const createAdmin = async () => {
  try {
    const adminEmail = 'admin@myevents.com'; // Updated to reflect "My Events"
    const adminPassword = 'admin123'; // Use a strong password in production
    const hashedPassword = await bcrypt.hash(adminPassword, 12);

    const adminUser = new User({
      name: 'Admin User',
      email: adminEmail,
      password: hashedPassword,
      role: 'admin'
    });

    const existingUser = await User.findOne({ email: adminEmail });
    if (existingUser) {
      console.log('Admin user already exists');
    } else {
      await adminUser.save();
      console.log('Admin user created successfully!');
      console.log(`Email: ${adminEmail}, Password: ${adminPassword}, Role: admin`);
    }
  } catch (error) {
    console.error('Error creating admin:', error);
  } finally {
    await mongoose.connection.close();
    console.log('Database connection closed');
  }
};

// Run the seed function
createAdmin();
import mongoose from "mongoose";
import dotenv from "dotenv";
import Event from "./models/event.js";


dotenv.config();

const mockEvents = [
  {
    title: "Tech Innovation Summit 2024",
    description:
      "Join industry leaders for cutting-edge technology discussions and networking opportunities.",
    date: "September 15, 2025",
    time: "9:00 AM",
    location: "KICC Convention Center",
    price: 1,
    availableTickets: 150,
    category: "Technology",
    imageUrl: "/public/images/image1.jpg",
  },
  {
    title: "Digital Marketing Masterclass",
    description:
      "Learn the latest digital marketing strategies from experts in the field.",
    date: "September 20, 2025",
    time: "2:00 PM",
    location: "Sarit Business Center",
    price: 1,
    availableTickets: 75,
    category: "Business",
    imageUrl: "/public/images/images.jpg",
  },
  {
    title: "Creative Design Workshop",
    description:
      "Hands-on workshop for designers to explore new creative techniques and tools.",
    date: "September 25, 2025",
    time: "10:00 AM",
    location: "Westlands Art District",
    price: 1,
    availableTickets: 30,
    category: "Design",
    imageUrl: "/public/images/image4.jpg",
  },
  {
    title: "Health & Wellness Expo",
    description:
      "Discover the latest in health, wellness, and fitness with expert speakers and exhibitors.",
    date: "October 2, 2025",
    time: "11:00 AM",
    location: "Embu Health Center",
    price: 1,
    availableTickets: 200,
    category: "Health",
    imageUrl: "/public/images/image8.jpg",
  },
  {
    title: "Music Festival 2024",
    description:
      "Three days of incredible music featuring top artists from around the world.",
    date: "October 10-12, 2025",
    time: "6:00 PM",
    location: "Ksumu Music Grounds",
    price: 1,
    availableTickets: 500,
    category: "Music",
    imageUrl: "/public/images/image7.jpg",
  },
  {
    title: "Startup Pitch Competition",
    description:
      "Watch innovative startups pitch their ideas to investors and industry experts.",
    date: "October 18, 2025",
    time: "1:00 PM",
    location: "Nakuru Valley Hub",
    price: 1,
    availableTickets: 100,
    category: "Business",
    imageUrl: "/public/images/image6.jpg",
  },
];

const seedDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log(" MongoDB connected");

    await Event.deleteMany(); 
    await Event.insertMany(mockEvents);

    console.log(" Mock events inserted successfully");
    process.exit();
  } catch (error) {
    console.error(" Error seeding DB:", error);
    process.exit(1);
  }
};

seedDB();

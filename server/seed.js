require("dotenv").config();
const mongoose = require("mongoose");
const connectDB = require("./config/db");
const Product = require("./models/Product");

const sampleProducts = [
  {
    name: "Sony Alpha a7 III Mirrorless Camera",
    description: "Professional full-frame mirrorless camera. Perfect for weddings, events, and high-quality videography. Includes a 28-70mm lens, 2 batteries, and a 64GB SD card.",
    imageUrl: "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=600&auto=format&fit=crop&q=60",
    category: "Electronics",
    dailyRate: 45.00,
    depositAmount: 300.00,
    available: true,
  },
  {
    name: "Coleman 4-Person Cabin Camping Tent",
    description: "Weatherproof 4-person cabin tent with instant setup. Features a built-in rainfly, screen room, and durable double-thick fabric for comfortable outdoor adventures.",
    imageUrl: "https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?w=600&auto=format&fit=crop&q=60",
    category: "Outdoors",
    dailyRate: 15.00,
    depositAmount: 50.00,
    available: true,
  },
  {
    name: "DeWalt Cordless Drill & Impact Driver Combo Kit",
    description: "High-performance 20V MAX cordless drill and driver kit. Includes two lithium-ion batteries, a charger, and a tough carrying bag. Ideal for DIY and home improvement.",
    imageUrl: "https://images.unsplash.com/photo-1504148455328-c376907d081c?w=600&auto=format&fit=crop&q=60",
    category: "Tools",
    dailyRate: 12.50,
    depositAmount: 40.00,
    available: true,
  },
  {
    name: "JBL PartyBox 310 Portable Bluetooth Speaker",
    description: "Monstrous sound, dazzling lights, and incredible power. Perfect for backyard parties, events, and karaoke night. Up to 18 hours of battery life and splash-proof.",
    imageUrl: "https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=600&auto=format&fit=crop&q=60",
    category: "Electronics",
    dailyRate: 35.00,
    depositAmount: 150.00,
    available: true,
  },
  {
    name: "Specialized Rockhopper Mountain Bike",
    description: "Trail-ready mountain bike with a lightweight aluminum frame, hydraulic disc brakes, and front suspension. Comes with a helmet and a secure bike lock.",
    imageUrl: "https://images.unsplash.com/photo-1485965120184-e220f721d03e?w=600&auto=format&fit=crop&q=60",
    category: "Outdoors",
    dailyRate: 25.00,
    depositAmount: 100.00,
    available: true,
  },
  {
    name: "Karcher K5 Premium Electric Pressure Washer",
    description: "2000 PSI high-pressure washer with water-cooled induction motor. Excellent for cleaning driveways, siding, cars, and patio furniture. Includes standard spray wands.",
    imageUrl: "https://images.unsplash.com/photo-1528190336454-13cd56b45b5a?w=600&auto=format&fit=crop&q=60",
    category: "Tools",
    dailyRate: 20.00,
    depositAmount: 80.00,
    available: true,
  },
  {
    name: "Retrospec Inflatable Stand-Up Paddleboard",
    description: "10-foot inflatable SUP kit, complete with aluminum paddle, manual pump, leash, and backpack. Stable, lightweight, and perfect for lakes, rivers, or calm ocean water.",
    imageUrl: "https://images.unsplash.com/photo-1500964757637-c85e8a162699?w=600&auto=format&fit=crop&q=60",
    category: "Water Sports",
    dailyRate: 22.00,
    depositAmount: 75.00,
    available: true,
  },
  {
    name: "Meta Quest 3 VR Headset (128GB)",
    description: "Next-gen mixed reality headset with two Touch Plus controllers. Experience immersive gaming, virtual meetings, and spatial entertainment. Fully sanitized before every rental.",
    imageUrl: "https://images.unsplash.com/photo-1593508512255-86ab42a8e620?w=600&auto=format&fit=crop&q=60",
    category: "Electronics",
    dailyRate: 30.00,
    depositAmount: 200.00,
    available: true,
  },
  {
    name: "Premium Star Wars Darth Vader Costume",
    description: "Authentic, high-quality Darth Vader replica costume. Includes heavy fabric cape, detailed chest control box, 3D armor components, and a voice-changing helmet.",
    imageUrl: "https://images.unsplash.com/photo-1569003339405-ea396a5a8a90?w=600&auto=format&fit=crop&q=60",
    category: "Clothing",
    dailyRate: 18.00,
    depositAmount: 60.00,
    available: true,
  },
];

const seedDatabase = async () => {
  try {
    // Connect to database
    await mongoose.connect(process.env.MONGO_URI);
    console.log("🌱  Connected to MongoDB for seeding...");

    // Clean existing products
    await Product.deleteMany({});
    console.log("🧹  Existing products cleared.");

    // Seed the database
    const createdProducts = await Product.insertMany(sampleProducts);
    console.log(`🎉  Successfully seeded ${createdProducts.length} rental products!`);

    // Disconnect
    await mongoose.disconnect();
    console.log("🔌  Disconnected from MongoDB. Seeding script finished.");
    process.exit(0);
  } catch (error) {
    console.error(`❌  Error seeding database: ${error.message}`);
    process.exit(1);
  }
};

seedDatabase();

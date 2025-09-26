const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

// User schema (copy of your model)
const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  username: { type: String, required: true, unique: true },
  hashed_password: { type: String, required: true },
  device_info: { type: Object },
  location_info: { type: Object },
}, { timestamps: true });

const User = mongoose.model("User", userSchema);

// Sample game user data
const sampleUsers = [
  {
    email: "player1@game.com",
    username: "DragonSlayer92",
    password: "password123",
    device_info: {
      platform: "PC",
      browser: "Chrome",
      os: "Windows 10"
    },
    location_info: {
      country: "USA",
      timezone: "PST"
    }
  },
  {
    email: "player2@game.com",
    username: "MagicWizard",
    password: "securepass456",
    device_info: {
      platform: "Mobile",
      browser: "Safari",
      os: "iOS 16"
    },
    location_info: {
      country: "Canada",
      timezone: "EST"
    }
  },
  {
    email: "player3@game.com",
    username: "StealthNinja",
    password: "ninja789",
    device_info: {
      platform: "Console",
      browser: "PlayStation",
      os: "PS5"
    },
    location_info: {
      country: "Japan",
      timezone: "JST"
    }
  },
  {
    email: "admin@game.com",
    username: "GameAdmin",
    password: "adminpass",
    device_info: {
      platform: "PC",
      browser: "Firefox",
      os: "Linux Ubuntu"
    },
    location_info: {
      country: "Germany",
      timezone: "CET"
    }
  },
  {
    email: "tester@game.com",
    username: "BetaTester",
    password: "testpass",
    device_info: {
      platform: "Mobile",
      browser: "Chrome Mobile",
      os: "Android 13"
    },
    location_info: {
      country: "Australia",
      timezone: "AEST"
    }
  }
];

async function populateDatabase() {
  try {
    // Connection string from environment or default
    const mongoUri = process.env.MONGO_URI || "mongodb://mongo:27017/user_management";
    
    console.log("Connecting to MongoDB...");
    await mongoose.connect(mongoUri);
    console.log("Connected to MongoDB successfully!");

    // Check if database already has data
    const existingUserCount = await User.countDocuments();
    
    if (existingUserCount > 0) {
      console.log(`Database already contains ${existingUserCount} users. Skipping population.`);
      process.exit(0);
    }

    console.log("Database is empty. Starting population...");

    // Hash passwords and insert users
    const usersToInsert = await Promise.all(
      sampleUsers.map(async (userData) => {
        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(userData.password, saltRounds);
        
        return {
          email: userData.email,
          username: userData.username,
          hashed_password: hashedPassword,
          device_info: userData.device_info,
          location_info: userData.location_info
        };
      })
    );

    // Insert all users
    const insertedUsers = await User.insertMany(usersToInsert);
    console.log(`Successfully inserted ${insertedUsers.length} users into the database!`);

    // Log inserted usernames for verification
    console.log("Inserted users:");
    insertedUsers.forEach(user => {
      console.log(`- ${user.username} (${user.email})`);
    });

  } catch (error) {
    console.error("Error populating database:", error.message);
    process.exit(1);
  } finally {
    await mongoose.disconnect();
    console.log("Disconnected from MongoDB");
  }
}

// Run the population script
populateDatabase();
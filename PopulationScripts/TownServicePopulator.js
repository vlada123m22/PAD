const mongoose = require("mongoose");
const Location = require("../../models/Location"); 

const MONGO_URI = process.env.MONGO_URI || "mongodb://localhost:27017/townDB";

async function seed() {
  try {
    await mongoose.connect(MONGO_URI);
    console.log("Connected to Town DB");

    await Location.deleteMany({});
    console.log("Cleared old locations");

    const locations = [
      { lobbyId: 2001, locationId: 1, name: "Town Square", occupants: [] },
      { lobbyId: 2001, locationId: 2, name: "Speakeasy", occupants: [] },
      { lobbyId: 2001, locationId: 3, name: "Marketplace", occupants: [] },
      { lobbyId: 2001, locationId: 4, name: "Apothecary", occupants: [] },
      { lobbyId: 2001, locationId: 5, name: "Forest", occupants: [] },
      { lobbyId: 2001, locationId: 6, name: "Hospital", occupants: [] },
      { lobbyId: 2001, locationId: 7, name: "Post Office", occupants: [] },
      { lobbyId: 2001, locationId: 8, name: "Warehouse", occupants: [] },
      { lobbyId: 2001, locationId: 9, name: "Back Alley", occupants: [] }
    ];

    await Location.insertMany(locations);
    console.log("Town DB seeded with default locations");

    process.exit(0);
  } catch (err) {
    console.error("Seeding error:", err);
    process.exit(1);
  }
}

seed();

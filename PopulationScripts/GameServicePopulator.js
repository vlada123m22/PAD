import mongoose from "mongoose";
import dotenv from "dotenv";
import { Character } from "./models/Character.js";
import { Lobby } from "./models/Lobby.js";
import { Role } from "./models/Role.js";
import { v4 as uuidv4 } from "uuid";

dotenv.config();

const MONGO_URI = process.env.MONGO_URI_GAME || "mongodb://mongo:27017/gameservice";

async function seedRoles() {
  const count = await Role.countDocuments();
  if (count === 0) {
    console.log("Seeding roles...");
    await Role.insertMany([
      { role_id: uuidv4(), name: "Warrior" },
      { role_id: uuidv4(), name: "Mage" },
      { role_id: uuidv4(), name: "Healer" }
    ]);
  } else {
    console.log("Roles already seeded.");
  }
}

async function seedLobbies() {
  const count = await Lobby.countDocuments();
  if (count === 0) {
    console.log("Seeding lobbies...");
    await Lobby.insertMany([
      { max_players: 4 },
      { max_players: 6 }
    ]);
  } else {
    console.log("Lobbies already seeded.");
  }
}

async function seedCharacters() {
  const count = await Character.countDocuments();
  if (count === 0) {
    console.log("Seeding characters...");
    const lobbies = await Lobby.find();
    const roles = await Role.find();
    if (lobbies.length && roles.length) {
      const characters = [];
      lobbies.forEach((lobby) => {
        roles.forEach((role) => {
          characters.push({
            character_id: uuidv4(),
            lobby_id: lobby._id.toString(),  // Changed this
            user_id: uuidv4(),
            role_id: role._id.toString()     // And this
          });
        });
      });
      await Character.insertMany(characters);
    }
  } else {
    console.log("Characters already seeded.");
  }
}

async function main() {
  try {
    await mongoose.connect(MONGO_URI);
    console.log("Connected to MongoDB.");

    await seedRoles();
    await seedLobbies();
    await seedCharacters();

    console.log("Seeding complete.");
    await mongoose.disconnect();
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}

main();

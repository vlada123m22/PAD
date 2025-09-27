const mongoose = require("mongoose");
const Character = require("../../models/Character");


const roleMap = {
  1: "Mafia",
  2: "Spy",
  3: "Detective",
  4: "Doctor",
  5: "Mayor",
  6: "Citizen",
  7: "Vampire",
  8: "Town Drunk"
};

async function seedCharacters() {
  await mongoose.connect("mongodb://localhost:27017/mafia", {
    useNewUrlParser: true,
    useUnifiedTopology: true
  });

  console.log("Connected to MongoDB...");

  await Character.deleteMany({});
 
  const characters = [
    {
      characterId: 1,
      userId: 1,
      roleId: 1, // Mafia
      role: roleMap[1]
    },
    {
      characterId: 2,
      userId: 2,
      roleId: 2, // Spy
      role: roleMap[2]
    },
    {
      characterId: 3,
      userId: 3,
      roleId: 3, // Detective
      role: roleMap[3]
    },
    {
      characterId: 4,
      userId: 4,
      roleId: 4, // Doctor
      role: roleMap[4]
    },
    {
      characterId: 5,
      userId: 5,
      roleId: 5, // Mayor
      role: roleMap[5]
    },
     {
      characterId: 6,
      userId: 6,
      roleId: 6, // Citizen
      role: roleMap[6]
    },
    {
      characterId: 7,
      userId: 7,
      roleId: 7, // Vampire
      role: roleMap[7]
    },
    {
      characterId: 8,
      userId: 8,
      roleId: 8, // Town Drunk
      role: roleMap[8]
    },
  ];

  await Character.insertMany(characters);
  console.log("Characters seeded!");
  mongoose.disconnect();
}

seedCharacters().catch(err => {
  console.error(err);
  mongoose.disconnect();
});

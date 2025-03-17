const mongoose = require("mongoose");
require("dotenv").config();

const mongoUri = process.env.MONGODB;

async function initializeDatabase() {
  await mongoose
    .connect(mongoUri)
    .then(() => {
      console.log("Connected Successfully.");
    })
    .catch((error) => {
      console.log("Connection Failed.", error);
    });
}

module.exports = { initializeDatabase };

import mongoose from "mongoose";
import dns from "dns";

dns.setServers(["1.1.1.1", "8.8.8.8"]);

async function db() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
  } catch (error) {
    console.error("Database connection error:", error);
  }
}

export default db;

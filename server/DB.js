const mongoose = require("mongoose");

const connectDB = async () => {
  const MONGO_URI =
    process.env.MONGO_URI || "mongodb://localhost:27017/chatapp";
  try {
    await mongoose.connect(MONGO_URI);

    const host = mongoose.connection.host;
    if (host.includes("mongodb.net")) {
      console.log("connected with Mongo (Atlas)");
    } else {
      console.log("connected with Mongo (Local)");
    }
  } catch (error) {
    console.log(error.message, "connection to MongoDB failed");
  }
};
module.exports = connectDB
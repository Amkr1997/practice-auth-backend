const mongoose = require("mongoose");
require("dotenv").config({ path: ".env" });

const initialization = async () => {
  const mongoURI = process.env.MONGO_URI;

  try {
    const connectDB = await mongoose.connect(mongoURI);

    if (connectDB) {
      console.log("Connected to mongoDB");
    }
  } catch (error) {
    console.log(error);
  }
};

module.exports = { initialization };

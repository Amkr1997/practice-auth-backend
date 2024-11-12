const mongoose = require("mongoose");
require("dotenv").config({ path: ".env" });

const mongoURI = process.env.MONGO_URI;

const initialization = async () => {
  try {
    const connectDB = await mongoose.connect(mongoURI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    if (connectDB) {
      console.log("Connected to mongoDB");
    }
  } catch (error) {
    console.log(error);
  }
};

module.exports = { initialization };

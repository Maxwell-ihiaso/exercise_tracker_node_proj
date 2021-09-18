const express = require("express");
const cors = require("cors");
const connectDB = require("./server/db/connectDB");
const morgan = require("morgan");
require("dotenv").config();

const app = express();

// view engine
app.set("view engine", "ejs");

// middlewares
app.use(cors());
app.use(morgan("dev"));
app.use(express.static("public"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Get requests
app.use("/", require("./server/routes/indexRoute"));
app.use("/api", require("./server/routes/trackerRoute"));

PORT = process.env.PORT || 5000;
const start = async () => {
  try {
    console.log(`Connecting to DB...`);
    await connectDB(process.env.MONGODB_URI);
    console.log(`Connected to DB`);
    console.log(`starting server...`);
    app.listen(PORT, (err) => {
      if (err) {
        console.log(err);
        process.exit(1);
      }
      console.log(`Server started. Running on port http://localhost:${PORT}`);
    });
  } catch (error) {
    console.log(`Unable to conect to DB: ${error.message}`);
  }
};

start();

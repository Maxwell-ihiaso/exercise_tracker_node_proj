const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const createError = require("http-errors");
require("dotenv").config();
require("./server/db/mongooseInit");

const app = express();

// view engine
app.set("view engine", "ejs");

// middlewares
app.use(cors());
app.use(morgan("dev"));
app.use("./public", express.static(__dirname + "./public"));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Get requests
app.use("/", require("./server/routes/indexRoute"));
app.use("/api", require("./server/routes/trackerRoute"));

// Handle unknown routes
app.use((req, res, next) => {
  next(createError.NotFound());
});

// Error handler
app.use((err, req, res, next) => {
  res.status(err.status || 500).json({
    error: {
      status: err.status,
      message: err.message,
    },
  });
});

PORT = process.env.PORT || 5000;

app.listen(PORT, (err) => {
  if (err) {
    console.log(err);
  }
  console.log(`Server started. Running on port http://localhost:${PORT}`);
});

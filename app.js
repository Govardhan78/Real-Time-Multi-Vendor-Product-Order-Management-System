const express = require("express");
const cors = require("cors");

const routes = require("./routes");
const errorHandler = require("./middleware/error.middleware");

const app = express();

app.use(cors());

app.use(express.json());

app.use(express.urlencoded({ extended: true }));

app.use("/uploads", express.static("uploads"));

app.use("/api", routes);

app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "Server is running",
  });
});

app.use(errorHandler);

module.exports = app;

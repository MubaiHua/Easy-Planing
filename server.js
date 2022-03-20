const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");

const userAuth = require("./routes/api/authRoutes");
const calenderRoute = require("./routes/api/calenderRoutes");
const logRoute = require("./routes/api/logRoutes");
const taskRoute = require("./routes/api/taskRoutes");

const app = express();
const cors = require("cors");

// Bodyparser Middleware
app.use(bodyParser.json());

app.use(cors());

//DB config
const db = require("./config/keys").mongoURI;

//COnnect to Mongo
mongoose
  .connect(process.env.MONGODB_URI || db)
  .then(() => console.log("MongoDB Connected..."))
  .catch((err) => console.log(err));

// Use Routes
app.use("/api/authRoutes", userAuth);
app.use("/api/calenderRoutes", calenderRoute);
app.use("/api/logRoutes", logRoute);
app.use("/api/taskRoutes", taskRoute);

if (process.env.NODE_ENV === "production") {
  app.use(express.static("client/build"));
  const path = require("path");
  app.get("/", (req, res) => {
    res.sendFile(path.resolve(__dirname, "client", "build", "index.html"));
  });
  app.get("/log-in", (req, res) => {
    res.sendFile(path.resolve(__dirname, "client", "build", "index.html"));
  });
  app.get("/sign-up", (req, res) => {
    res.sendFile(path.resolve(__dirname, "client", "build", "index.html"));
  });
  app.get("/calender", (req, res) => {
    res.sendFile(path.resolve(__dirname, "client", "build", "index.html"));
  });
  app.get("/task", (req, res) => {
    res.sendFile(path.resolve(__dirname, "client", "build", "index.html"));
  });
}

const port = process.env.PORT || 5000;

app.listen(port, () => console.log(`Server started on port ${port}`));

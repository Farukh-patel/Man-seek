const express = require("express");
const app = express();
const cors = require("cors");
const connectDB = require("./config/mongoose-connection");
const userRouter = require("./routes/userRouter");
const aiRouter = require("./routes/aiRouter");
const cookieParser = require("cookie-parser");
const path = require("path");
require("dotenv").config();

// Middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser());

app.use(
  cors({
    origin: true,       // allow whatever origin the browser requested
    credentials: true
  })
);


// Routes
app.use("/users", userRouter);
app.use("/ai", aiRouter);

// Check for frontend build in production
if (process.env.NODE_ENV === "production") {
  const buildPath = path.join(__dirname, "../client/dist"); // ✅ Vite uses "dist"
  app.use(express.static(buildPath));

  app.get("*", (req, res) => {
    res.sendFile(path.resolve(buildPath, "index.html"));
  });
}

// Default route
app.get("/", (req, res) => {
  res.send("hey ~");
});

// Connect DB and start server
connectDB().then(() => {
  app.listen(3000, () => {
    console.log("Server started at port 3000!!");
  });
});

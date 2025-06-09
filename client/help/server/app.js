const express = require("express");
const app = express();
const cors = require('cors');
const connectDB = require("./config/mongoose-connection");
const userRouter = require("./routes/userRouter");
const aiRouter=require("./routes/aiRouter")
const cookieParser = require("cookie-parser");
require('dotenv').config(); 
// Middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser());

app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true
}));

// Routes
app.use("/users", userRouter);
app.use("/ai", aiRouter);

app.get("/", (req, res) => {
  res.send("hey ~");
});

// Connect to DB then start the server
connectDB().then(() => {
  app.listen(3000, () => {
    console.log("Server started at port 3000!!");
  });
});

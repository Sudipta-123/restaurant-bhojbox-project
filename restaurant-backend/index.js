const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const bcrypt = require("bcrypt");

require("dotenv").config();

const dns = require("dns");
dns.setServers(["8.8.8.8"]);

const app = express();

app.use(cors());
app.use(express.json());

// MongoDB connection
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.log("MongoDB error:", err));

// Route
app.get("/", (req, res) => {
  res.send("Backend is running...");
});

const User = require("./models/User");
const Order = require("./models/Order");

// Signup
app.post("/signup", async (req, res) => {
  console.log("/signup hit");
  console.log("BODY:", req.body);

  try {
    const { username, email, phone, password } = req.body;

    const existingUser = await User.findOne({ username });

    if (existingUser) {
      return res.json({
        success: false,
        message: "User already exists",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      username,
      email,
      phone,
      password: hashedPassword,
    });

    await newUser.save();

    res.json({
      success: true,
      message: "User registered successfully",
    });
  } catch (err) {
    console.log("Signup error:", err);

    res.json({
      success: false,
      message: "Error",
    });
  }
});

// Login
app.post("/login", async (req, res) => {
  console.log("/login hit");
  console.log("BODY:", req.body);

  try {
    const { username, password } = req.body;

    const user = await User.findOne({ username });

    if (!user) {
      return res.json({
        success: false,
        message: "User not found",
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.json({
        success: false,
        message: "Wrong password",
      });
    }

    res.json({
      success: true,
      message: "Login successful",
    });
  } catch (err) {
    console.log("Login error:", err);

    res.json({
      success: false,
      message: "Error",
    });
  }
});

// Save Order
app.post("/order", async (req, res) => {
  console.log("/order hit");
  console.log("BODY:", req.body);

  try {
    const {
      name,
      email,
      mobile,
      item,
      quantity,
      address,
      paymentType,
      upiApp,
      amount,
    } = req.body;

    const newOrder = new Order({
      name,
      email,
      mobile,
      item,
      quantity,
      address,
      paymentType,
      upiApp,
      amount,
    });

    await newOrder.save();

    res.json({
      success: true,
      message: "Order saved successfully",
    });
  } catch (err) {
    console.log("Order save error:", err);

    res.status(500).json({
      success: false,
      message: "Error saving order",
    });
  }
});

// Server start
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log("Server running on port " + PORT);
});


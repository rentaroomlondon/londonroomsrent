import express from "express";
import cookieParser from "cookie-parser";
import mongoose from "mongoose";
import dotenv from "dotenv";
import bodyParser from 'body-parser';
import compression from "compression";
import cors from "cors";
import authRoutes from "./Routes/authRoutes.js";
import userRoutes from "./Routes/userRoutes.js";
import maintenanceRoutes from "./Routes/maintenanceRoutes.js";
import adminRoutes from "./Routes/adminRoutes.js";
import { connectRedis } from "./utils/redis.js";
import listingRoutes from "./Routes/listingRoutes.js";
import bookingRoutes from "./Routes/bookingRoutes.js";
import contactRoutes from "./Routes/contactRoutes.js";
import { startMaintenanceReminder } from "./utils/maintenanceReminder.js";
import staffRoutes from "./Routes/staffRoutes.js";
import AttendanceRoutes from "./Routes/AttendanceRoutes.js"
import TaskRoutes from "./Routes/TaskRoutes.js"

dotenv.config();

const app = express();
const Port = process.env.Port || 8000;

// Start maintenance reminder
// startMaintenanceReminder();

// Body parser
app.use(bodyParser.json({ limit: '10mb' }));
app.use(bodyParser.urlencoded({ limit: '10mb', extended: true }));

// ✅ GZIP compression
app.use(compression());

// CORS
const corsOptions = {
  origin: process.env.CLIENT_URL,
  credentials: true,
  optionsSuccessStatus: 200,
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
};
app.use(cors(corsOptions));

// Middleware
app.use(express.json());
app.use(cookieParser());

app.set('trust proxy', true);

//Route
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/maintenance", maintenanceRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/listings", listingRoutes);
app.use("/api/bookings", bookingRoutes);
app.use("/api/contact", contactRoutes);
app.use("/api/staff", staffRoutes);
app.use("/api/attendance", AttendanceRoutes);
app.use("/api/tasks", TaskRoutes);

// Test route
app.get('/', (req, res) => {
  res.json({ message: "API is working" });
});

// MongoDB connection
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI, {});
    console.log("MongoDB is connected");
  } catch (err) {
    console.error("MongoDB connection failed:", err.message);
  }
};

// Error handling
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});

// Start server after Redis and MongoDB are connected
const startServer = async () => {
  try {
    await connectRedis();
    console.log("Redis connected 🔐");

    await connectDB();

    app.listen(Port, () => {
      console.log(`Server is running on port ${Port}`);
    });

  } catch (err) {
    console.error("Startup error:", err);
  }
};

startServer();
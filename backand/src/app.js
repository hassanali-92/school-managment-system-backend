import express from "express";
import cors from "cors";
import authRoutes from "./routes/auth.routes.js"; // Route import kiya

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

// ✅ Routes yahan connect honge (NOT in server.js)
app.use("/api/auth", authRoutes);

// Test Route
app.get("/", (req, res) => {
  res.send("SMS API Running 🚀");
});

export default app;
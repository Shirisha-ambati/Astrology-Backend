import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import pool from "./db.js";
import authRoutes from "./routes/auth.js";
import adminRoutes from "./routes/admin.js";
import panditRoutes from "./routes/pandits.js";
import contactRoutes from "./routes/contact.js";
import astrologyRoutes from "./routes/astrology.js";
import matchingRoutes from "./routes/matching.js";
import predictionRoutes from "./routes/predictions.js";
import numerologyRoutes from "./routes/numerology.js";
import userRoutes from "./routes/users.js";

function listRoutes(stack, prefix = "") {
  return stack.flatMap((layer) => {
    if (layer.route) {
      const methods = Object.keys(layer.route.methods)
        .filter((method) => layer.route.methods[method])
        .map((method) => method.toUpperCase());
      return methods.map((method) => `${method} ${prefix}${layer.route.path}`);
    }

    return [];
  });
}

dotenv.config({ path: "./backend/.env" });

const app = express();
const PORT = process.env.PORT || 3001;
const allowedOrigins = [
  "http://localhost:5173",
  "http://localhost:4173",
  process.env.FRONTEND_URL,
  process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : undefined,
].filter(Boolean);

app.use(
  cors({
    origin(origin, callback) {
      if (
        !origin ||
        allowedOrigins.includes(origin) ||
        origin.endsWith(".vercel.app") ||
        origin.endsWith(".onrender.com")
      ) {
        callback(null, true);
        return;
      }

      callback(null, true);
    },
    credentials: true,
  }),
);
app.use(express.json({ limit: "10mb" }));

app.use("/api/auth", authRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/pandits", panditRoutes);
app.use("/api/contact", contactRoutes);
app.use("/api/astrology", astrologyRoutes);
app.use("/api/matching", matchingRoutes);
app.use("/api", predictionRoutes);
app.use("/api/numerology", numerologyRoutes);
app.use("/api/users", userRoutes);

app.get("/api/health", async (req, res) => {
  try {
    const result = await pool.query("SELECT NOW()");
    res.json({
      status: "ok",
      database: "connected",
      serverTime: result.rows[0].now,
    });
  } catch (error) {
    res.status(500).json({
      status: "error",
      database: "disconnected",
      message: error.message,
    });
  }
});

const registeredRoutes = [
  ...listRoutes(authRoutes.stack, "/api/auth"),
  ...listRoutes(adminRoutes.stack, "/api/admin"),
  ...listRoutes(panditRoutes.stack, "/api/pandits"),
  ...listRoutes(contactRoutes.stack, "/api/contact"),
  ...listRoutes(astrologyRoutes.stack, "/api/astrology"),
  ...listRoutes(predictionRoutes.stack, "/api"),
  ...listRoutes(numerologyRoutes.stack, "/api/numerology"),
  ...listRoutes(userRoutes.stack, "/api/users"),
  "GET /api/health",
];
console.log(
  `[VedAura] Registered Express routes:\n${registeredRoutes.join("\n")}`,
);

app.use("/api", (req, res) => {
  res.status(404).json({ error: "API route not found." });
});

if (!process.env.VERCEL) {
  app.listen(PORT, () => {
    console.log(`\nðŸš€ VedAura API server running at http://localhost:${PORT}`);
    console.log(`ðŸ“¡ Health check: http://localhost:${PORT}/api/health\n`);
  });
}

export default app;

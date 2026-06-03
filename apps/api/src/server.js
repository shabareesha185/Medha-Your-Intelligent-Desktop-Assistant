import express from "express";
import dotenv from "dotenv";
import dns from "dns";

import { connectDB } from "./config/database.js";

dns.setServers(["1.1.1.1", "8.8.8.8"]);

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Express Configurations
app.use(express.json());

// MongoDB connection
await connectDB();

app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "Medha API Running",
  });
});

// Routers
import commandRoutes from "./routes/command.routes.js";
import historyRoutes from "./routes/history.routes.js";
import promptRoutes from "./routes/prompt.routes.js";
import voiceRoutes from "./routes/voice.routes.js";
import speakRoutes from "./routes/speak.routes.js";
import statusRoutes from "./routes/status.routes.js";

app.use("/command", commandRoutes);
app.use("/history", historyRoutes);
app.use("/prompt", promptRoutes);
app.use("/voice", voiceRoutes);
app.use("/speak", speakRoutes);
app.use("/status", statusRoutes);

app.listen(PORT, () => {
  console.log(`Server running on port http://localhost:${PORT}`);
});

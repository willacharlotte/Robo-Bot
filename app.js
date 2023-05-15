import "dotenv/config";
import express from "express";
import { VerifyDiscordRequest } from "./backend/utils.js";
import interactions from "./backend/handlers/interactions.js";

// Create an express app
const app = express();
// Get port, or default to 3000
const PORT = process.env.APP_PORT || 3000;
// Parse request body and verifies incoming requests using discord-interactions package
app.use(express.json({ verify: VerifyDiscordRequest(process.env.PUBLIC_KEY) }));

// Store for in-progress games. In production, you'd want to use a DB
const activeGames = {};

/**
 * Interactions endpoint URL where Discord will send HTTP requests
 */
app.post("/interactions", (req, res) => interactions(req, res, activeGames));

app.listen(PORT, () => {
  console.log(`app started on port: ${PORT}`);
});

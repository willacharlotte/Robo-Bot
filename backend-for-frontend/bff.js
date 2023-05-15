import "dotenv/config";
import getSplash from "./handlers/splash.js";
import { getNewGame, postNewGame } from "./handlers/new-game.js";
import { getPlayerJoin, postPlayerJoin } from "./handlers/player-join.js";
import { getGameStart, postGameStart } from "./handlers/game-start.js";
import express from "express";

const PORT = process.env.BFF_PORT || 3001;

const bff = express().use(express.static("./frontend/"));

bff.get("/", getSplash);

bff.get("/new-game", getNewGame);
bff.post("/new-game", postNewGame);

bff.get("/player-join", getPlayerJoin);
bff.post("/player-join", postPlayerJoin);

bff.get("/game-start", getGameStart);
bff.post("/game-start", postGameStart);

bff.listen(PORT, () => {
  console.log(`bff started on port: ${PORT}`);
});

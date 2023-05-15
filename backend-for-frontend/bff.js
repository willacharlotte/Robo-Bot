import "dotenv/config";
import getSplash from "./handlers/splash.js";
import { getNewGame, postNewGame } from "./handlers/new-game.js";
import { getPlayerJoin, postPlayerJoin } from "./handlers/player-join.js";
import { getGameStart, postGameStart } from "./handlers/game-start.js";
import express from "express";

const PORT = process.env.BFF_PORT || 3001;

const bff = express().use(express.static("./frontend/"));

let game = {
  isReady: false,
  exists: false,
  data: {}
}

let players = [];

bff.get("/", getSplash);

bff.get("/new-game", (req, res) => getNewGame(req, res, game));
bff.post("/new-game", (req, res) => postNewGame(req, res, game));

bff.get("/player-join", (req, res) => getPlayerJoin(req, res, players));
bff.post("/player-join", (req, res) => postPlayerJoin(req, res, players));

bff.get("/game-start", getGameStart);
bff.post("/game-start", postGameStart);

bff.listen(PORT, () => {
  console.log(`bff started on port: ${PORT}`);
});

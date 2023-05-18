import 'dotenv/config';
import getSplash from './handlers/splash.js';
import { getNewGame, postNewGame } from './handlers/new-game.js';
import { getPlayerJoin, postPlayerJoin } from './handlers/player-join.js';
import { getGameStart, postGameStart } from './handlers/game-start.js';
import express from 'express';
import { EventEmitter } from 'events';

const PORT = process.env.BFF_PORT || 3001;

const bff = express().use(express.static('./frontend/')).use(express.json());

export const emitter = new EventEmitter();

/**
 * game.data should be of the following format:
 * {
 *   createdBy: <string> discord username of game creator
 *   id: <uuid>/<int>/idk??? unique id of the game;
 *   TODO: figure what else needs to be passed through
 * }
 */
export const game = {
  isReady: false,
  exists: false,
  data: {},
};

/**
 * a player {} in the array should be of the following format:
 * {
 *   username: <string> discord username
 *   characterName: <string> name of character in the game
 * }
 */
export const players = [];

bff.get('/new-game', getNewGame);
bff.post('/new-game', postNewGame);

bff.get('/player-join', getPlayerJoin);
bff.post('/player-join', postPlayerJoin);

bff.post('/game-start', postGameStart);
bff.get('/game/:id', getGameStart);

bff.get('/', getSplash);

bff.listen(PORT, () => {
  console.log(`bff started on port: ${PORT}`);
});

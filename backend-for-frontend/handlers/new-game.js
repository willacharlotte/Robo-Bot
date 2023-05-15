import { emitter, game } from "../bff.js";

export const getNewGame = (req, res) => {
  new Promise((resolve) => {
    if (!game.exists) {
      emitter.on("new-game", (gameData) => resolve(gameData));
    } else {
      resolve(game.data);
    }
  }).then((gameData) => {
    res.status(200).json(gameData).end();
  });
};

export const postNewGame = (req, res) => {
  game.data = req.body;
  game.exists = true;
  emitter.emit("new-game", game.data);
  res.end("Game successfully posted");
};

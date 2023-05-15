import { emitter, game, players } from "../bff.js";

const hasPlayerJoined = (players, newPlayer) => {
  return !!players.find((player) => player.username === newPlayer.username);
};

export const getPlayerJoin = (req, res) => {
  new Promise((resolve) => {
    if (!game.exists) {
      throw "No game has been created yet";
    }
    emitter.on("player-join", (newPlayer) => resolve(newPlayer));
  })
    .then((newPlayer) => {
      res.status(200).json(newPlayer).end();
    })
    .catch((reason) => {
      res.status(400).end(reason);
    });
};

export const postPlayerJoin = (req, res) => {
  const newPlayer = req.body;

  if (!game.exists) {
    res.status(400).end("No game has been created yet");
  } else if (hasPlayerJoined(players, newPlayer)) {
    res.status(400).end(`${newPlayer.username} has already joined`);
  } else {
    players.push(newPlayer);
    emitter.emit("player-join", newPlayer);
    res.end("Player successfully posted");
  }
};

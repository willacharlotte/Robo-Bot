const hide = (element) => {
<<<<<<< HEAD
  element.classList.add("hide");
};

const show = (element) => {
  element.classList.remove("hide");
=======
  element.classList.add('hide');
};

const show = (element) => {
  element.classList.remove('hide');
>>>>>>> main
};

const bindData = (element, key, value) => {
  element.innerHTML = element.innerHTML.replace(`{{${key}}}`, value);
};

<<<<<<< HEAD
const url = "http://localhost:3001";

const awaitNewGame = document.getElementById("await-new-game");
const newGame = document.getElementById("new-game");
const awaitPlayers = document.getElementById("await-players");
const playersTable = document.getElementById("players-table")
const playersTableBody = document.getElementById("players-table-body");
const playerTemplate = document.getElementById("player-template");
const awaitGameStart = document.getElementById("await-game-start");
const gameStart = document.getElementById("game-start");

async function waitingRoom() {
  const gameData = await fetch(url + "/new-game").then((res) => res.json());
  bindData(newGame, "createdBy", gameData.createdBy);
=======
const url = 'http://localhost:3001';

const awaitNewGame = document.getElementById('await-new-game');
const newGame = document.getElementById('new-game');
const awaitPlayers = document.getElementById('await-players');
const playersTable = document.getElementById('players-table');
const playersTableBody = document.getElementById('players-table-body');
const playerTemplate = document.getElementById('player-template');
const awaitGameStart = document.getElementById('await-game-start');
const startGame = document.getElementById('start-game');
const gameStarted = document.getElementById('game-started');

async function startGameOnClick() {
  return new Promise((resolve) => {
    startGame.addEventListener('click', (event) => {
      event.preventDefault();
      show(gameStarted);
      fetch(url + '/game-start', { method: 'POST' }).then(resolve);
    });
  });
}

async function waitingRoom() {
  const gameData = await fetch(url + '/new-game').then((res) => res.json());
  bindData(newGame, 'createdBy', gameData.createdBy);
>>>>>>> main

  hide(awaitNewGame);
  show(newGame);

  const players = [];
  show(awaitPlayers);
  show(playersTable);
<<<<<<< HEAD

  while (players.length < 6) {
    const newPlayerData = await fetch(url + "/player-join").then((res) =>
=======
  show(awaitGameStart);

  while (players.length < 6) {
    const newPlayerData = await fetch(url + '/player-join').then((res) =>
>>>>>>> main
      res.json()
    );
    const newPlayerNode = playerTemplate.cloneNode(true);

<<<<<<< HEAD
    bindData(newPlayerNode, "username", newPlayerData.username);
    bindData(newPlayerNode, "characterName", newPlayerData.characterName);
=======
    bindData(newPlayerNode, 'username', newPlayerData.username);
    bindData(newPlayerNode, 'characterName', newPlayerData.characterName);
>>>>>>> main

    playersTableBody.appendChild(newPlayerNode);
    show(newPlayerNode);

    players.push(newPlayerData);
  }
<<<<<<< HEAD
=======
  show(startGame);
  hide(awaitGameStart);

  await startGameOnClick();
  window.location.href = `/game/${gameData.id}`;
>>>>>>> main
}

waitingRoom();

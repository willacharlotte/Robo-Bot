const hide = (element) => {
  element.classList.add('hide');
};

const show = (element) => {
  element.classList.remove('hide');
};

const bindData = (element, key, value) => {
  element.innerHTML = element.innerHTML.replace(`{{${key}}}`, value);
};

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

async function startGameOnClick(gameData) {
  show(startGame);
  hide(awaitGameStart);

  startGame.addEventListener('click', async (event) => {
    event.preventDefault();
    show(gameStarted);
    await fetch(url + '/game-start', { method: 'POST' });
    window.location.href = `/game/${gameData.id}`;
  });
}

async function waitingRoom() {
  const gameData = await fetch(url + '/new-game').then((res) => res.json());
  bindData(newGame, 'createdBy', gameData.createdBy);

  hide(awaitNewGame);
  show(newGame);

  const players = [];
  show(awaitPlayers);
  show(playersTable);
  show(awaitGameStart);

  while (players.length < 6) {
    if (players.length === 2) {
      startGameOnClick(gameData);
    }

    const newPlayerData = await fetch(url + '/player-join').then((res) =>
      res.json()
    );
    const newPlayerNode = playerTemplate.cloneNode(true);

    bindData(newPlayerNode, 'username', newPlayerData.username);
    bindData(newPlayerNode, 'characterName', newPlayerData.characterName);

    playersTableBody.appendChild(newPlayerNode);
    show(newPlayerNode);

    players.push(newPlayerData);
  }
}

waitingRoom();

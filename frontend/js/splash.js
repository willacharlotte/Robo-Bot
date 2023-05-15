const hide = (element) => {
  element.classList.add("hide");
};

const show = (element) => {
  element.classList.remove("hide");
};

const bindData = (element, key, value) => {
  element.innerHtml = element.innerHtml.replace(`{{${key}}}`, value);
};

const url = "http://localhost:3001";

const awaitNewGame = document.getElementById("await-new-game");
const newGame = document.getElementById("new-game");
const awaitPlayers = document.getElementById("await-players");
const joiningPlayers = document.getElementById("joining-players");
const playerTemplate = document.getElementById("player-template");
const awaitGameStart = document.getElementById("await-game-start");
const gameStart = document.getElementById("game-start");

fetch(url + "/new-game")
  .then((res) => res.json())
  .then((data) => {
    bindData(newGame, "createdBy", data.createdBy);

    hide(awaitNewGame);
    show(newGame);
    show(awaitPlayers);
  });

import { root } from '../bff.js';

export const getGameStart = (req, res) => {
  const id = req.params.id;
  const htmlFile = 'frontend/html/board.html';
  res.sendFile(htmlFile, { root: root });
};

export const postGameStart = (req, res) => {
  // TODO post back-end game start

  // just to replicate a timeous response lol... better ux fr fr
  setTimeout(() => {
    res.status(200).end();
  }, 1000);
};

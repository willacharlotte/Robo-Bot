import 'dotenv';
import { root } from '../bff.js';
import fetch from 'node-fetch';

export const getGameStart = (req, res) => {
  const id = req.params.id;
  const htmlFile = 'frontend/html/board.html';
  res.sendFile(htmlFile, { root: root });
};

export async function postGameStart(req, res) {
  const backend = process.env.APP_URL;
  await fetch(`${backend}/start/${req.body.id}`, { method: 'POST' });

  // just to replicate a timeous response lol... better ux fr fr
  setTimeout(() => {
    res.status(200).end();
  }, 1000);
}

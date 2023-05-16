import 'dotenv/config';
import express from 'express';
import { VerifyDiscordRequest, dealCards } from './backend/utils.js';
import interactions from './backend/handlers/interactions.js';

// Create an express app
const app = express();
// Get port, or default to 3000
const PORT = process.env.PORT || 3000;
// Parse request body and verifies incoming requests using discord-interactions package
app.use(express.json({ verify: VerifyDiscordRequest(process.env.PUBLIC_KEY) }));

// Store for in-progress games. In production, you'd want to use a DB
const activeGames = {};

/**
 * Interactions endpoint URL where Discord will send HTTP requests
 */
app.post('/interactions', (req, res) => interactions(req, res, activeGames));

app.post('/start/:game', (req, res) => {
  // Get the game id from the endpoint parameter
  const gameId = req.params.game;

  if (activeGames[gameId] !== undefined) {
    if (!activeGames[gameId].gameStarted) {
      const playerCount = activeGames[gameId].playerCount;

      if (playerCount > 0) {
        // Mark the game as started
        activeGames[gameId].gameStarted = true;

        // Deal the cards according to the number of players
        const cards = dealCards(playerCount);

        // Assign the Case File Confidential
        activeGames[gameId].caseFileConfidential = cards.caseFileConfidential;

        // Assign all the player hands
        let i = 0;
        activeGames[gameId].players.forEach((player) => {
          activeGames[gameId].playerData[player].hand = cards.playerHands[i++];
          //TODO: Send each player their hand using interaction token
        });

        console.log(activeGames[gameId]);

        res.end(`Game with id ${gameId} started!`);
      } else {
        res.statusCode = 400;
        res.end('Insufficient players to start a game.');
      }
    } else {
      res.statusCode = 400;
      res.end('This game has already been started');
    }
  } else {
    res.statusCode = 404;
    res.end(`A game with id ${gameId} does not exist.`);
  }
});

app.listen(PORT, () => {
  console.log('Listening on port', PORT);
});

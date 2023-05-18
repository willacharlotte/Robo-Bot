import 'dotenv/config';
import { getRPSChoices } from './game.js';
import { capitalize, InstallGlobalCommands } from './utils.js';

// Get the game choices from game.js
function createCommandChoices() {
  const choices = getRPSChoices();
  const commandChoices = [];

  for (let choice of choices) {
    commandChoices.push({
      name: capitalize(choice),
      value: choice.toLowerCase(),
    });
  }

  return commandChoices;
}

// Simple test command
const TEST_COMMAND = {
  name: 'test',
  description: 'Basic command',
  type: 1,
};

// Start a game of Clue
const START_GAME = {
  name: 'start',
  description: 'Start a game of Clue',
  type: 1,
};

// Show another player a card from your hand
const SHOW_CARD = {
  name: 'show',
  description: 'Show another player a card',
  type: 1,
};

const ALL_COMMANDS = [TEST_COMMAND, START_GAME, SHOW_CARD];

InstallGlobalCommands(process.env.APP_ID, ALL_COMMANDS);

import 'dotenv/config';
import { getRPSChoices } from './game.js';
import { capitalize, InstallGlobalCommands } from './utils.js';
import {
  ROOM_COMMANDS,
  SUSPECT_COMMANDS,
  WEAPON_COMMANDS,
} from './constants.js';

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
  options: [
    {
      type: 3,
      name: 'recipient',
      description: 'Choose which player you want to show a card to',
      required: true,
    },
    {
      type: 3,
      name: 'card',
      description: 'Choose the card you would like to show',
      required: true,
      choices: [...SUSPECT_COMMANDS, ...WEAPON_COMMANDS, ...ROOM_COMMANDS],
    },
  ],
  type: 1,
};

const SUGGEST = {
  name: 'suggest',
  description: 'Make a suggestion',
  options: [
    {
      type: 3,
      name: 'suspect',
      description: 'Who do you think committed the murder?',
      required: true,
      choices: SUSPECT_COMMANDS,
    },
    {
      type: 3,
      name: 'weapon',
      description: 'Which weapon do you think was used?',
      required: true,
      choices: WEAPON_COMMANDS,
    },
    {
      type: 3,
      name: 'room',
      description: 'Where do you think the murder was committed?',
      required: true,
      choices: ROOM_COMMANDS,
    },
  ],
  type: 1,
};

const ACCUSE = {
  name: 'accuse',
  description: 'Make an accusation (Warning: this is final!)',
  options: [
    {
      type: 3,
      name: 'suspect',
      description: 'Who do you think committed the murder?',
      required: true,
      choices: SUSPECT_COMMANDS,
    },
    {
      type: 3,
      name: 'weapon',
      description: 'Which weapon do you think was used?',
      required: true,
      choices: WEAPON_COMMANDS,
    },
    {
      type: 3,
      name: 'room',
      description: 'Where do you think the murder was committed?',
      required: true,
      choices: ROOM_COMMANDS,
    },
  ],
  type: 1,
};

const ALL_COMMANDS = [TEST_COMMAND, START_GAME, SHOW_CARD, SUGGEST, ACCUSE];

InstallGlobalCommands(process.env.APP_ID, ALL_COMMANDS);

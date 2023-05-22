import 'dotenv/config';
import { verifyKey } from 'discord-interactions';
import { SUSPECTS, ROOMS, WEAPONS } from './constants.js';

export function VerifyDiscordRequest(clientKey) {
  return function (req, res, buf, encoding) {
    const signature = req.get('X-Signature-Ed25519');
    const timestamp = req.get('X-Signature-Timestamp');

    const isValidRequest = verifyKey(buf, signature, timestamp, clientKey);
    if (!isValidRequest) {
      res.status(401).send('Bad request signature');
      throw new Error('Bad request signature');
    }
  };
}

export async function DiscordRequest(endpoint, options) {
  // append endpoint to root API URL
  const url = 'https://discord.com/api/v10/' + endpoint;
  // Stringify payloads
  if (options.body) options.body = JSON.stringify(options.body);
  
  const res = await fetch(url, {
    headers: {
      Authorization: `Bot ${process.env.DISCORD_TOKEN}`,
      'Content-Type': 'application/json; charset=UTF-8',
      'User-Agent':
        'DiscordBot (https://github.com/discord/discord-example-app, 1.0.0)',
    },
    ...options,
  });
  // throw API errors
  if (!res.ok) {
    const data = await res.json();
    console.log(res.status);
    throw new Error(JSON.stringify(data));
  }
  // return original response
  return res;
}

export async function InstallGlobalCommands(appId, commands) {
  // API endpoint to overwrite global commands
  const endpoint = `applications/${appId}/commands`;

  try {
    // This is calling the bulk overwrite endpoint: https://discord.com/developers/docs/interactions/application-commands#bulk-overwrite-global-application-commands
    await DiscordRequest(endpoint, { method: 'PUT', body: commands });
  } catch (err) {
    console.error(err);
  }
}

// Simple method that returns a random emoji from list
export function getRandomEmoji() {
  const emojiList = [
    '😭',
    '😄',
    '😌',
    '🤓',
    '😎',
    '😤',
    '🤖',
    '😶‍🌫️',
    '🌏',
    '📸',
    '💿',
    '👋',
    '🌊',
    '✨',
  ];
  return emojiList[Math.floor(Math.random() * emojiList.length)];
}

export function capitalize(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

export function dealCards(playerCount) {
  // Copy card decks
  let suspects = [...SUSPECTS];
  let rooms = [...ROOMS];
  let weapons = [...WEAPONS];

  // Remove a random card from each of the decks
  const caseFileConfidential = [
    suspects.splice(Math.floor(Math.random() * SUSPECTS.length), 1)[0],
    rooms.splice(Math.floor(Math.random() * ROOMS.length), 1)[0],
    weapons.splice(Math.floor(Math.random() * WEAPONS.length), 1)[0],
  ];

  // Shuffle the remaining cards together
  let evidence = [...suspects, ...rooms, ...weapons];
  let currentIndex = evidence.length,
    randomIndex;

  while (currentIndex != 0) {
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;
    [evidence[currentIndex], evidence[randomIndex]] = [
      evidence[randomIndex],
      evidence[currentIndex],
    ];
  }

  // Split the shuffled cards into player hands according to player count
  let playerHands = new Array(playerCount);

  for (let i = 0; i < evidence.length; i++) {
    // Initialize each hand with a new array
    if (i < playerCount) {
      playerHands[i] = [];
    }

    // Add a card to a hand
    playerHands[i % playerCount].push(evidence[i]);
  }

  return {
    caseFileConfidential: caseFileConfidential,
    playerHands: playerHands,
  };
}

export async function getUsername(userId) {
  const user = await DiscordRequest(`users/${userId}`, {
    method: 'GET',
  }).then((res) => res.json());

  return user.username;
}

export async function dmUser(userId, message) {
  const response = await DiscordRequest(`users/@me/channels`, {
    method: 'POST',
    body: {
      recipient_id: userId,
    },
  });
  const channel_id = (await response.json()).id;
  // console.log(channel_id);

  await DiscordRequest(`/channels/${channel_id}/messages`, {
    method: 'POST',
    body: {
      content: message,
    },
  });
}

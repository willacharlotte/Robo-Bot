import 'dotenv/config';
import {
  InteractionType,
  InteractionResponseType,
  InteractionResponseFlags,
  MessageComponentTypes,
  ButtonStyleTypes,
} from 'discord-interactions';
import { DiscordRequest, dealCards } from '../utils.js';
import { CHARACTER_CHOICE, CARDEMOJI } from '../constants.js';

export default async function interactions(req, res, activeGames) {
  // Interaction type and data
  const { type, id, data } = req.body;

  /**
   * Handle verification requests
   */
  if (type === InteractionType.PING) {
    return res.send({ type: InteractionResponseType.PONG });
  }

  /**
   * Handle slash command requests
   * See https://discord.com/developers/docs/interactions/application-commands#slash-commands
   */
  if (type === InteractionType.APPLICATION_COMMAND) {
    const { name } = data;

    // "test" command
    if (name === 'test') {
      const cards = dealCards(3);
      // Send a message into the channel where command was triggered from
      return res.send({
        type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
        data: {
          // Returns the dealt cards for three players
          content:
            `The murder was committed by ${cards.caseFileConfidential[0]} with the ${cards.caseFileConfidential[2]} in the ${cards.caseFileConfidential[1]}` +
            '\n\nThe hands are:\n\nPlayer 1:\n' +
            cards.playerHands[0] +
            '\n\nPlayer 2:\n' +
            cards.playerHands[1] +
            '\n\nPlayer 3:\n' +
            cards.playerHands[2],
        },
      });
    }
    // "challenge" command
    if (name === 'challenge' && id) {
      const userId = req.body.member.user.id;
      // User's object choice
      const objectName = req.body.data.options[0].value;

      // Create active game using message ID as the game ID
      activeGames[id] = {
        id: userId,
        objectName,
      };

      return res.send({
        type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
        data: {
          // Fetches a random emoji to send from a helper function
          content: `Rock papers scissors challenge from <@${userId}>`,
          components: [
            {
              type: MessageComponentTypes.ACTION_ROW,
              components: [
                {
                  type: MessageComponentTypes.BUTTON,
                  // Append the game ID to use later on
                  custom_id: `accept_button_${req.body.id}`,
                  label: 'Accept',
                  style: ButtonStyleTypes.PRIMARY,
                },
              ],
            },
          ],
        },
      });
    }
    // "start" command
    if (name === 'start' && id) {
      const userId = req.body.member.user.id;

      // Create active game using message ID as the game ID
      activeGames[id] = {
        caseFileConfidential: [],
        players: new Set(),
        playerData: {},
        playerCount: 0,
        gameStarted: false,
      };

      console.log('Game started with id ' + id); // TODO: send this id to the BFF

      return res.send({
        type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
        data: {
          content: `<@${userId}> has started a game of Clue. Click here to join!`,
          components: [
            {
              type: MessageComponentTypes.ACTION_ROW,
              components: [
                {
                  type: MessageComponentTypes.BUTTON,
                  custom_id: `join_button_${req.body.id}`,
                  label: 'Join',
                  style: ButtonStyleTypes.PRIMARY,
                },
              ],
            },
          ],
        },
      });
    }
  }

  /**
   * Handle requests from interactive components
   * See https://discord.com/developers/docs/interactions/message-components#responding-to-a-component-interaction
   */
  if (type === InteractionType.MESSAGE_COMPONENT) {
    // custom_id set in payload when sending message component
    const componentId = data.custom_id;

    // if (componentId.startsWith('accept_button_')) {
    //   // get the associated game ID
    //   const gameId = componentId.replace('accept_button_', '');
    //   // Delete message with token in request body
    //   const endpoint = `webhooks/${process.env.APP_ID}/${req.body.token}/messages/${req.body.message.id}`;
    //   try {
    //     await res.send({
    //       type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
    //       data: {
    //         // Fetches a random emoji to send from a helper function
    //         content: 'What is your object of choice?',
    //         // Indicates it'll be an ephemeral message
    //         flags: InteractionResponseFlags.EPHEMERAL,
    //         components: [
    //           {
    //             type: MessageComponentTypes.ACTION_ROW,
    //             components: [
    //               {
    //                 type: MessageComponentTypes.STRING_SELECT,
    //                 // Append game ID
    //                 custom_id: `select_choice_${gameId}`,
    //                 options: getShuffledOptions(),
    //               },
    //             ],
    //           },
    //         ],
    //       },
    //     });
    //     // Delete previous message
    //     await DiscordRequest(endpoint, { method: 'DELETE' });
    //   } catch (err) {
    //     console.error('Error sending message:', err);
    //   }
    // } else if (componentId.startsWith('select_choice_')) {
    //   // get the associated game ID
    //   const gameId = componentId.replace('select_choice_', '');

    //   if (activeGames[gameId]) {
    //     // Get user ID and object choice for responding user
    //     const userId = req.body.member.user.id;
    //     const objectName = data.values[0];
    //     // Calculate result from helper function
    //     const resultStr = getResult(activeGames[gameId], {
    //       id: userId,
    //       objectName,
    //     });

    //     // Remove game from storage
    //     delete activeGames[gameId];
    //     // Update message with token in request body
    //     const endpoint = `webhooks/${process.env.APP_ID}/${req.body.token}/messages/${req.body.message.id}`;

    //     try {
    //       // Send results
    //       await res.send({
    //         type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
    //         data: { content: resultStr },
    //       });
    //       // Update ephemeral message
    //       await DiscordRequest(endpoint, {
    //         method: 'PATCH',
    //         body: {
    //           content: 'Nice choice ' + getRandomEmoji(),
    //           components: [],
    //         },
    //       });
    //     } catch (err) {
    //       console.error('Error sending message:', err);
    //     }
    //   }
    // }

    if (componentId.startsWith('join_button_')) {
      // get the associated game ID
      const gameId = componentId.replace('join_button_', '');
      // Delete message with token in request body
      const endpoint = `webhooks/${process.env.APP_ID}/${req.body.token}/messages/${req.body.message.id}`;

      if (activeGames[gameId].players[req.body.member.user.id] === undefined) {
        // Add to the player count
        activeGames[gameId].playerCount++;

        try {
          await res.send({
            type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
            data: {
              content: 'Which character do you want to play as?',
              // Indicates it'll be an ephemeral message
              flags: InteractionResponseFlags.EPHEMERAL,
              components: [
                {
                  type: MessageComponentTypes.ACTION_ROW,
                  components: [
                    {
                      type: MessageComponentTypes.STRING_SELECT,
                      // Append game ID
                      custom_id: `select_character_${gameId}`,
                      options: CHARACTER_CHOICE,
                    },
                  ],
                },
              ],
            },
          });
          // Delete previous message
          if (activeGames[gameId].playerCount >= 6) {
            await DiscordRequest(endpoint, { method: 'DELETE' });
          }
        } catch (err) {
          console.error('Error sending message:', err);
        }
      } else {
        try {
          await res.send({
            type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
            data: {
              // Fetches a random emoji to send from a helper function
              content: 'You have already joined this game.',
              // Indicates it'll be an ephemeral message
              flags: InteractionResponseFlags.EPHEMERAL,
            },
          });
        } catch (err) {
          console.error('Error sending message:', err);
        }
      }
    } else if (componentId.startsWith('select_character_')) {
      // get the associated game ID
      const gameId = componentId.replace('select_character_', '');

      if (activeGames[gameId]) {
        // Get user ID and object choice for responding user
        const userId = req.body.member.user.id;
        const character = data.values[0];
        // Update message with token in request body
        const endpoint = `webhooks/${process.env.APP_ID}/${req.body.token}/messages/${req.body.message.id}`;

        activeGames[gameId].players.add(userId);
        activeGames[gameId].playerData[userId] = {
          character: character,
          hand: [],
        };
        console.log(activeGames[gameId].players); //TODO: send each new player to the BFF

        try {
          // Send results
          await res.send({
            type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
            data: {
              content: `<@${userId}> has joined a game of Clue as ${character}!`,
            },
          });
          // Update ephemeral message
          await DiscordRequest(endpoint, {
            method: 'PATCH',
            body: {
              content:
                'You have successfully joined. Click here to show your hand once the game has been started!',
              components: [
                {
                  type: MessageComponentTypes.ACTION_ROW,
                  components: [
                    {
                      type: MessageComponentTypes.BUTTON,
                      custom_id: `show_hand_button_${gameId}`,
                      label: 'Show Hand',
                      style: ButtonStyleTypes.PRIMARY,
                    },
                  ],
                },
              ],
            },
          });
        } catch (err) {
          console.error('Error sending message:', err);
        }
      }
    } else if (componentId.startsWith('show_hand_button_')) {
      // get the associated game ID
      const gameId = componentId.replace('show_hand_button_', '');

      if (activeGames[gameId]) {
        const userId = req.body.member.user.id;
        const endpoint = `webhooks/${process.env.APP_ID}/${req.body.token}/messages/${req.body.message.id}`;
        const hand = activeGames[gameId].playerData[userId].hand;

        if (hand.length !== 0) {
          console.log(`Player ${userId} requested their hand`);

          let formattedHand = '';
          hand.forEach((card) => {
            formattedHand += `${card} ${CARDEMOJI[card]}\n`;
          });

          // Send a new ephemeral message with the player's hand
          await res.send({
            type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
            data: {
              content: `Here's your hand:\n\n${formattedHand}`,
              flags: InteractionResponseFlags.EPHEMERAL,
            },
          });
        } else {
          await res.send({
            type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
            data: {
              content: 'The game has not started yet.',
              flags: InteractionResponseFlags.EPHEMERAL,
            },
          });
        }
      }
    }
  }
}

import 'dotenv/config';
import {
  InteractionType,
  InteractionResponseType,
  InteractionResponseFlags,
  MessageComponentTypes,
  ButtonStyleTypes,
} from 'discord-interactions';
import { DiscordRequest, dealCards, dmUser, getUsername } from '../utils.js';
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

      console.log('Game started with id ' + id);

      await fetch(`${process.env.BFF_URL}/new-game`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          createdBy: await getUsername(userId),
          id: id,
        }),
      });

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
    // "show" command
    if (name === 'show' && id) {
      const userId = req.body.member.user.id;
      const recipient = req.body.data.options[0].value;
      const recipientId = recipient.substring(2, recipient.length - 1);
      const card = req.body.data.options[1].value;

      await dmUser(
        recipientId,
        `<@${userId}> showed you the following card:\n**${card}** ${CARDEMOJI[card]}`
      );

      return res.send({
        type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
        data: {
          content: `You have successfully shown **${card}** ${CARDEMOJI[card]} to <@${recipientId}>!`,
          flags: InteractionResponseFlags.EPHEMERAL,
        },
      });
    }
    // "suggest" command
    if (name === 'suggest' && id) {
      const userId = req.body.member.user.id;
      const suspect = req.body.data.options[0].value;
      const weapon = req.body.data.options[1].value;
      const room = req.body.data.options[2].value;

      return res.send({
        type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
        data: {
          content: `<@${userId}> suggests that the murder was committed by **${suspect}** ${CARDEMOJI[suspect]} with the **${weapon}** ${CARDEMOJI[weapon]} in the **${room}** ${CARDEMOJI[room]}.`,
        },
      });
    }
    // "accuse" command
    if (name === 'accuse' && id) {
      const userId = req.body.member.user.id;
      const suspect = req.body.data.options[0].value;
      const weapon = req.body.data.options[1].value;
      const room = req.body.data.options[2].value;

      const gameId = Object.keys(activeGames)[0];
      const cfc = activeGames[gameId].caseFileConfidential;

      if (cfc.includes(suspect) && cfc.includes(weapon) && cfc.includes(room)) {
        return res.send({
          type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
          data: {
            content: `@everyone, <@${userId}> correctly accuses **${suspect}** ${CARDEMOJI[suspect]} of committing the murder with the **${weapon}** ${CARDEMOJI[weapon]} in the **${room}** ${CARDEMOJI[room]}! They win the game!!`,
          },
        });
      } else {
        return res.send({
          type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
          data: {
            content: `@everyone, <@${userId}> incorrectly accuses **${suspect}** ${CARDEMOJI[suspect]} of committing the murder with the **${weapon}** ${CARDEMOJI[weapon]} in the **${room}** ${CARDEMOJI[room]}. They are now out of the game.`,
          },
        });
      }
    }
  }

  /**
   * Handle requests from interactive components
   * See https://discord.com/developers/docs/interactions/message-components#responding-to-a-component-interaction
   */
  if (type === InteractionType.MESSAGE_COMPONENT) {
    // custom_id set in payload when sending message component
    const componentId = data.custom_id;

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

        console.log(process.env.BFF_URL);

        await fetch(`${process.env.BFF_URL}/player-join`, {
          method: 'post',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            username: await getUsername(userId),
            characterName: character,
          }),
        });

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
                'You have successfully joined. Please wait for the game to start!',
              components: [],
            },
          });
        } catch (err) {
          console.error('Error sending message:', err);
        }
      }
    }
  }
}

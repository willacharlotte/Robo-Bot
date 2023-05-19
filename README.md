# Cluedo!

### _A web based app with discord integrations_

---

## Description

This project implements a game of Cluedo, a classic murder mystery board game. It is designed to be played both on Discord and through a web interface. Cluedo is a game where players investigate a murder by gathering clues, interrogating suspects, and deducing the culprit, location, and weapon involved. This implementation offers an immersive and interactive gaming experience, allowing players to enjoy the game seamlessly on both Discord and the web.

## Project structure

Below is a basic overview of the project structure:

```
├── app.js
├── backend
│   ├── commands.js
│   ├── constants.js
│   ├── game.js
│   ├── handlers
│   │   └── interactions.js
│   └── utils.js
├── backend-for-frontend
│   ├── bff.js
│   ├── handlers
│   │   ├── game-start.js
│   │   ├── new-game.js
│   │   ├── not-found.js
│   │   ├── player-join.js
│   │   └── splash.js
│   └── helpers
│       └── get-frontend-path.js
├── frontend
│   ├── css
│   │   ├── hide.css
│   │   └── style.css
│   ├── html
│   │   └── index.html
│   └── js
│       ├── script.js
│       └── splash.js
├── LICENSE
├── package.json
├── package-lock.json
├── README.md
```

## Prerequisites

Before you start, you'll need to install [NodeJS](https://nodejs.org/en/download/) and [create a Discord app](https://discord.com/developers/applications) with the proper permissions:

- `applications.commands`
- `bot` (with Send Messages enabled)

## Project Setup

1. Clone the repository: `git clone https://github.com/willacharlotte/Robo-Bot.git`
2. Navigate to the project directory: `cd Robo-Bot`
3. Install the required dependencies: `npm install`
4. Configure the environment variables: Copy `.env.sample` to a new file `.env` and add the [credentials](#app-credentials)
5. Add the directory of the project to `PROJ_ROOT_DIR`, which can be optained by running `pwd`

## App Credentials

Find your credentials on the [discord developer portal](https://discord.com/developers/applications), under the `General Information` and `Bot` tabs for your app. Add them to your `.env`.

You'll need your app ID (`APP_ID`), bot token (`DISCORD_TOKEN`), and public key (`PUBLIC_KEY`).

## Install Slash Commands

Run the following command to register the commands to Discord

```sh
npm run register
```

## Run the App

1. Run `npm start:app` in the root directory to start the backend.
2. Run `npm start:bff` to start the backend for frontend
3. Open your web browser and navigate to `http://localhost:3001` for the frontend.

### Set up interactivity

The project needs a public endpoint where Discord can send requests. To develop and test locally, you can use something like [`ngrok`](https://ngrok.com/) to tunnel HTTP traffic.

Install ngrok if you haven't already, then start listening on port `3000`:

```
ngrok http 3000
```

You should see your connection open:

```
Tunnel Status                 online
Version                       2.0/2.0
Web Interface                 http://127.0.0.1:4040
Forwarding                    http://1234-someurl.ngrok.io -> localhost:3000
Forwarding                    https://1234-someurl.ngrok.io -> localhost:3000

Connections                  ttl     opn     rt1     rt5     p50     p90
                              0       0       0.00    0.00    0.00    0.00
```

Copy the forwarding address that starts with `https`, in this case `https://1234-someurl.ngrok.io`, then go to your [app's settings](https://discord.com/developers/applications).

On the **General Information** tab, there will be an **Interactions Endpoint URL**. Paste your ngrok address there, and append `/interactions` to it (`https://1234-someurl.ngrok.io/interactions` in the example).

Click **Save Changes**, and your app should be ready to run 🚀

## Contributors

[Daniel Shuttleworth](https://github.com/DanielSBBD)
[Karishma George](https://github.com/karishmag-bbd) 
[Sagofiwa Moyo](https://github.com/SagofiwaM)
[Willa Lyle](https://github.com/willacharlotte)

import express from "express";
import { WebSocketServer } from "ws";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Server variables.
const app = express();
const port = 3000;

app.use(express.static(path.join(__dirname, "public")));

const server = app.listen(port, () => {
  console.log(`Listening on ${port}`);
});

const sockserver = new WebSocketServer({ server });

// Start with player 0.
let playerId = 0;

// Game state.
const gameState = {
  players: [],
};

/**
 * Add a new player to game.
 * @param {object} player - The player data to be added.
 */
const addPlayer = (player) => {
  gameState.players.push(player);
};

/**
 * Update player game state.
 * @param {object} playerData - The player data to be updated.
 */
const updatePlayer = (playerData) => {
  gameState.players = gameState.players.map((player) => {
    if (player.playerId === playerData.playerId) {
      return playerData;
    } else {
      return player;
    }
  });
};

sockserver.on("connection", (ws) => {
  playerId++;
  console.log(`Player ${playerId} connected. Adding player to game state!`);
  addPlayer({ playerId: playerId });

  // Test for open connection.
  const isOpen = (ws) => ws.readyState === ws.OPEN;

  ws.on("message", (message) => {
    // Player data.
    const messageObject = JSON.parse(message.toString());
    const data = { ...messageObject, playerId };

    // Handle player state management.
    updatePlayer(data);

    sockserver.clients.forEach((client) => {
      // Ensure socket is open.
      if (!isOpen(sockserver)) {
        return;
      }
      client.send(JSON.stringify(gameState));
    });
  });

  ws.onerror = function () {
    console.log("websocket error");
  };

  ws.on("close", () => console.log("Client has disconnected!"));
});

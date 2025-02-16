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

/**
 * Remove player from game state.
 * @param {number} playerId - The player data to be removed.
 */
const removePlayer = (playerId) => {
  gameState.players = gameState.players.filter((player) => {
    return player.playerId !== playerId;
  });
};

sockserver.on("connection", (ws) => {
  // Give new player an id.
  playerId++;

  // Add player to game state.
  addPlayer({ playerId });
  console.log(`Player ${playerId} connected and added to game state!`);

  // Test for open connection.
  const isOpen = (ws) => ws.readyState === ws.OPEN;

  // Listen to client for messages.
  ws.on("message", (message) => {
    if (message.toString() === "Player ready") {
      sockserver.clients.forEach((client) => {
        // Ensure socket is open.
        if (!isOpen(sockserver)) {
          return;
        }
        client.send(JSON.stringify({ message: "Start player", playerId }));
      });
    } else {
      // Player data.
      const data = JSON.parse(message.toString());

      // Handle player state management.
      updatePlayer(data);

      sockserver.clients.forEach((client) => {
        // Ensure socket is open.
        if (!isOpen(sockserver)) {
          return;
        }
        client.send(JSON.stringify(gameState));
      });
    }
  });

  ws.onerror = function () {
    console.log("websocket error");
  };

  ws.on("close", () => {
    // Remove player from game state.
    removePlayer(playerId);
    console.log(`Player ${playerId} has disconnected!`);
  });
});

const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

const ws = new WebSocket("ws://localhost:3000");

const gameState = {
  players: [],
  connections: 0,
};

// Set circle properties
const centerX = canvas.width / 2;
const centerY = canvas.height / 2;
const radius = 10;

ws.onopen = () => {
  console.log("Connected to WebSocket server");
  gameState.connections++;
  console.log(gameState);
};

/**
 * Add a new player to game.
 * @param {object} player - The player data to be added.
 */
const addPlayer = (player) => {
  gameState.players.push(player);
  addPlayerToCanvas(player);
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
  addPlayerToCanvas(playerData);
};

/**
 * Add player to canvas.
 * @param {object} player - The player to add to the canvas.
 */
const addPlayerToCanvas = (player) => {
  // Start a new path
  ctx.beginPath();
  // Draw the circle
  ctx.arc(player.data?.x, player.data?.y, radius, 0, 2 * Math.PI);
  ctx.stroke();
};

/**
 * Clear game canvas.
 */
const clearGameCanvas = () => {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
};

/**
 * Check new player.
 * @param {object} data - Player data.
 * @reutrns {boolean} Whether the player is new.
 */
const checkPlayerIsNew = (data) => {
  let newPlayer;
  gameState.players.forEach((player) => {
    if (player.playerId !== data.playerId) {
      newPlayer = player;
    }
  });
  return !!newPlayer;
};

// Handle game updates, e.g., redraw objects based on received data
ws.onmessage = (event) => {
  const data = JSON.parse(event.data);
  const players = gameState.players;
  let newPlayer;

  if (players.length) {
    // Clear game canvas.
    clearGameCanvas();
    // Check if player is new.
    newPlayer = checkPlayerIsNew(data);
  } else {
    // No players yet.
    newPlayer = true;
  }

  if (newPlayer) {
    addPlayer(data);
  } else {
    updatePlayer(data);
  }

  console.log(gameState.players);
};

ws.onclose = () => {
  console.log("Disconnected from WebSocket server");
};

// Game logic (example: sending player input)
canvas.addEventListener("mousemove", (event) => {
  ws.send(JSON.stringify({ x: event.clientX, y: event.clientY }));
});

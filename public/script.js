const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

const ws = new WebSocket("ws://localhost:3000");

// Set circle properties
const centerX = canvas.width / 2;
const centerY = canvas.height / 2;
const radius = 10;

ws.onopen = () => {
  console.log("Connected to WebSocket server");
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

// Handle game updates, e.g., redraw objects based on received data
ws.onmessage = (event) => {
  const data = JSON.parse(event.data);
  clearGameCanvas();

  console.log(data);

  data.players.forEach((player) => {
    addPlayerToCanvas(player);
  });
};

ws.onclose = () => {
  console.log("Disconnected from WebSocket server");
};

// Game logic (example: sending player input)
canvas.addEventListener("mousemove", (event) => {
  ws.send(JSON.stringify({ x: event.clientX, y: event.clientY }));
});

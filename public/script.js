const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

const ws = new WebSocket("ws://localhost:3000");

// Set circle properties
const radius = 10;

// Start player ready.
ws.onopen = () => {
  const startPlayer = "Player ready";
  ws.send(startPlayer);
};

/**
 * Add player to canvas.
 * @param {object} player - The player to add to the canvas.
 */
const addPlayerToCanvas = (player) => {
  // Start a new path
  ctx.beginPath();
  // Draw the circle
  ctx.arc(player.x, player.y, radius, 0, 2 * Math.PI);
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
  // Extract data.
  const data = JSON.parse(event.data);

  if (data?.message === "Start player") {
    // Log player info.
    console.log(`Player ${data.playerId} is ready!`);

    // Store player in browser.
    if (!localStorage.getItem("thewall")) {
      localStorage.setItem("thewall", data.playerId);
    }
  } else {
    // Clear canvas.
    clearGameCanvas();

    // Add player data.
    data.players.forEach((player) => {
      addPlayerToCanvas(player);
    });
  }
};

ws.onclose = () => {
  // Remove player.
  localStorage.removeItem("thewall");
  console.log("Player removed.");
};

// Game logic (example: sending player input)
canvas.addEventListener("mousemove", (event) => {
  const playerId = +localStorage.getItem("thewall");
  ws.send(
    JSON.stringify({
      x: event.clientX,
      y: event.clientY,
      playerId,
    }),
  );
});

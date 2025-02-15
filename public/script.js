const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

const ws = new WebSocket("ws://localhost:3000");

// Set circle properties
const centerX = canvas.width / 2;
const centerY = canvas.height / 2;
const radius = 50;

ws.onopen = () => {
  console.log("Connected to WebSocket server");
  // Start a new path
  ctx.beginPath();
  // Draw the circle
  ctx.arc(centerX, centerY, radius, 0, 2 * Math.PI);
  // Stroke the circle (draw outline)
  ctx.stroke();
  // Optional: Fill the circle
  // ctx.fillStyle = 'blue';
  // ctx.fill();
};

ws.onmessage = (event) => {
  const data = JSON.parse(event.data);
  // Handle game updates, e.g., redraw objects based on received data
  console.log(data);
};

ws.onclose = () => {
  console.log("Disconnected from WebSocket server");
};

// Game logic (example: sending player input)
canvas.addEventListener("mousemove", (event) => {
  ws.send(JSON.stringify({ x: event.clientX, y: event.clientY }));
});

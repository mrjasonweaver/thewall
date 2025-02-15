const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

const ws = new WebSocket("ws://localhost:3000");

ws.onopen = () => {
  console.log("Connected to WebSocket server");
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

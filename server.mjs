import express from "express";
import { WebSocketServer } from "ws";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = 3000;
let count = 0;

app.use(express.static(path.join(__dirname, "public")));

const server = app.listen(port, () => {
  console.log(`Listening on ${port}`);
});

const sockserver = new WebSocketServer({ server });

sockserver.on("connection", (ws) => {
  count++;
  const player = count;
  console.log(`New player number ${player} connected!`);

  function isOpen(ws) {
    return ws.readyState === ws.OPEN;
  }

  ws.on("message", (message) => {
    sockserver.clients.forEach((client) => {
      // Ensure socket is open.
      if (!isOpen(sockserver)) {
        return;
      }

      const data = JSON.stringify(message.toString());
      client.send(data);
    });
  });

  ws.onerror = function () {
    console.log("websocket error");
  };

  ws.on("close", () => console.log("Client has disconnected!"));
});

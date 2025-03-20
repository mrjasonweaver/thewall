import { WebSocket } from "ws";
import express from "express";
import { WebSocketServer } from "ws";

describe("WebSocket Server Tests", () => {
  let server;
  let wss;
  let clientSocket;
  const PORT = 3000;
  const WS_URL = `ws://localhost:${PORT}`;

  beforeAll((done) => {
    // Setup express server and WebSocket server
    const app = express();
    server = app.listen(PORT, () => {
      wss = new WebSocketServer({ server });
      done();
    });
  });

  afterAll((done) => {
    if (clientSocket) {
      clientSocket.close();
    }
    server.close(done);
  });

  beforeEach((done) => {
    clientSocket = new WebSocket(WS_URL);
    clientSocket.on("open", done);
  });

  afterEach(() => {
    clientSocket.close();
  });

  test("should connect and receive player ID", (done) => {
    clientSocket.on("message", (data) => {
      const message = JSON.parse(data.toString());
      expect(message).toHaveProperty("message", "Start player");
      expect(message).toHaveProperty("playerId");
      done();
    });

    clientSocket.send("Player ready");
  });
});

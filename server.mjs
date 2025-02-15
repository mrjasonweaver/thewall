import express from 'express';
import { WebSocketServer } from 'ws';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

express()
    .use((_, res) =>
        res.sendFile('/websocket-client.html', { root: __dirname }),
    )
    .listen(3000, () => console.log(`Listening on ${3000}`));

const sockserver = new WebSocketServer({ port: 8080 });

sockserver.on('connection', ws => {
    console.log('New client connected!');
    ws.send('connection established');
    ws.on('close', () => console.log('Client has disconnected!'));
    ws.on('message', data => {
        sockserver.clients.forEach(client => {
            console.log(`distributing message: ${data}`);
            client.send(`${data}`);
        });
    });
    ws.onerror = function () {
        console.log('websocket error');
    };
});

const WebSocket = require('ws');
const fs = require('fs');

let config;
try {
    config = JSON.parse(fs.readFileSync('config.json'));
} catch (error) {
    console.error('Error reading config.json:', error);
    process.exit(1);
}

const wss = new WebSocket.Server({ port: config.server.port || 8080 });
const rooms = new Map();

wss.on('connection', ws => {
    console.log('Client connected');

    ws.on('message', message => {
        const data = JSON.parse(message);
        const { type, room, content, username } = data;

        if (type === 'join') {
            if (!config.rooms.includes(room)) {
                ws.send(JSON.stringify({ type: 'error', content: 'Invalid room code' }));
                ws.close();
                return;
            }
            if (!rooms.has(room)) {
                rooms.set(room, new Set());
            }
            rooms.get(room).add(ws);
            ws.room = room;
            ws.username = username;
            console.log(`${username} joined room ${room}`);
            // Broadcast user list to all clients in the room
            const users = Array.from(rooms.get(room)).map(client => client.username);
            rooms.get(room).forEach(client => {
                client.send(JSON.stringify({ type: 'users', users }));
            });
        } else if (type === 'message') {
            if (rooms.has(room)) {
                rooms.get(room).forEach(client => {
                    if (client !== ws && client.readyState === WebSocket.OPEN) {
                        client.send(JSON.stringify({ type: 'message', content, username: ws.username }));
                    }
                });
            }
        }
    });

    ws.on('close', () => {
        const roomName = ws.room;
        if (roomName && rooms.has(roomName)) {
            rooms.get(roomName).delete(ws);
            if (rooms.get(roomName).size === 0) {
                rooms.delete(roomName);
            } else {
                // Broadcast updated user list
                const users = Array.from(rooms.get(roomName)).map(client => client.username);
                rooms.get(roomName).forEach(client => {
                    client.send(JSON.stringify({ type: 'users', users }));
                });
            }
        }
        console.log('Client disconnected');
    });
});

console.log('WebSocket server started on port 8080');

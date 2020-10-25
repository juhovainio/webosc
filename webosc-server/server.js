const WebSocket = require('ws');
const OSC = require('osc-js');
const dgram = require('dgram');
const socket = dgram.createSocket('udp4');

// Setup websocket server
const wss = new WebSocket.Server({
    port: 8080
});

// Send UDP OSC messages
function sendMessage(message){
    console.log('Package sent');
    socket.send(message, 3333, '192.168.8.102', (error, bytes) => {
        // TODO: Handle errors
    });
}

// Receive websocket messages
wss.on('connection', (ws) => {
    console.log('Connection opened');
    ws.on('message', (message) => {
        sendMessage(message);
    });
});
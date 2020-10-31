const WebSocket = require('ws');
const https = require('https');
const fs = require('fs');
const OSC = require('osc-js');
const dgram = require('dgram');
const socket = dgram.createSocket('udp4');

const server = https.createServer({
    cert: fs.readFileSync('./cert.pem'),
    key: fs.readFileSync('./key.pem')
});

// Setup websocket server
const wss = new WebSocket.Server({
    port: 8080,
    server: server
});

// Send UDP OSC messages
function sendMessage(message){
    console.log('Package sent');
    socket.send(message, 3333, '192.168.227.97', (error, bytes) => {
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
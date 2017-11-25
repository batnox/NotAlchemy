const ServerState = require('./server-state');
const Client = require('./client');
const path = require('path');
const express = require('express');
const ClientState = require('./client-state');
const app = require('express')();
const http = require('http').Server(app);
const io = require('socket.io')(http);

app.use('/lib', express.static(path.resolve(__dirname + '/../../lib')));
app.use('/engine', express.static(__dirname + '/../engine'));
app.use('/gallery', express.static(__dirname + '/../gallery'));

app.use('/alchemy', express.static(__dirname + '/../alchemy'));
app.use('/bubbles', express.static(__dirname + '/../bubbles'));
app.use('/cnb', express.static(__dirname + '/../cnb'));
app.use('/snake', express.static(__dirname + '/../snake'));

app.get('/', function(req, res) {
  res.sendFile(path.resolve(__dirname + '/../../index.html'));
});

let clients = [];
let state = ServerState.GAME_SELECTION;

io.on('connection', function(socket) {
  let clientId;
  let worm;
  if (clients.length === 0 || clients[0] === null) {
    clientId = 0;
    worm = this.worm1;
  } else if (clients.length === 1 || clients[1] === null) {
    clientId = 1;
    worm = this.worm2;
  } else {
    throw Error(`Too many clients.`);
  }

  let client = new Client(clientId, socket, worm);
  clients[clientId] = client;
  console.log(`Client ${client.id} connected.`);
  socket.on('disconnect', () => {
    console.log(`Client ${client.id} disconnected.`);
    clients[client.id] = null;
    this.state = ServerState.GAME_SELECTION;
  });
  socket.on('message', (msg) => {
    handleMessage(client.id, msg);
  });
});

http.listen(3000, function() {
  console.log('Listening on *:3000');
});

function handleMessage(clientId, msg) {
  console.log(`${clientId}: ${msg}`);
  switch (state) {
    case ServerState.GAME_SELECTION:
      return handleGameSelectionMessage(clientId, msg);
    case ServerState.MP_SNAKE:
      return handleMultiplayerSnakeMessage(clientId, msg);
  }
}

function handleGameSelectionMessage(clientId, msg) {
  switch (msg) {
    case 'START_MP_SNAKE':
      clients[clientId].state = ClientState.WAITING;
      if (clients[0] && clients[0].state === ClientState.WAITING &&
        clients[1] && clients[1].state === ClientState.WAITING) {
        console.log('START_GAME -> 0');
        clients[0].socket.emit('message', 'START_GAME_0');
        clients[0].state = ClientState.PLAYING;
        console.log('START_GAME -> 1');
        clients[1].socket.emit('message', 'START_GAME_1');
        clients[1].state = ClientState.PLAYING;
        state = ServerState.MP_SNAKE;
      }
      break;
  }
}

function handleMultiplayerSnakeMessage(clientId, msg) {
  let client2;
  if (clientId === 0) {
    client2 = clients[1];
  } else {
    client2 = clients[0];
  }
  client2.socket.emit('message', msg);
}
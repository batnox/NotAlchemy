import {Client} from './client';
import {ServerState} from './server-state';

const path = require('path');
const express = require('express');
const app = require('express')();
const http = require('http').Server(app);
const io = require('socket.io')(http);

app.use('/lib', express.static(path.resolve(__dirname + '/../lib')));
app.use('/engine', express.static(__dirname + '/engine'));
app.use('/gallery', express.static(__dirname + '/gallery'));

app.use('/alchemy', express.static(__dirname + '/alchemy'));
app.use('/bubbles', express.static(__dirname + '/bubbles'));
app.use('/snake', express.static(__dirname + '/snake'));

app.get('/', function(req, res) {
  res.sendFile(path.resolve(__dirname + '/../index.html'));
});

let game;
let clients = [];
let state = ServerState.GAME_SELECTION;

io.on('connection', function(socket) {
  let worm;
  if (clients.length === 0) {
    worm = this.worm1;
  } else if (clients.length === 1) {
    worm = this.worm2;
  } else {
    throw Error(`Too many clients.`);
  }
  let client = new Client(clients.length, socket, worm);
  clients.push(client);
  console.log(`Client ${client.id} connected.`);
  socket.on('disconnect', () => {
    console.log(`Client ${client.id} disconnected.`);
    clients.splice(client.id, 1);
  });
  socket.on('message', (msg) => {
    handleMessage(client.id, msg);
  });
});

http.listen(3000, function() {
  console.log('listening on *:3000');
});

function handleMessage(clientId, msg) {
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
      game = new SnakeGame(true);
      state = ServerState.MP_SNAKE;
      break;
  }
}

function handleMultiplayerSnakeMessage(clientId, msg) {
  let client1;
  let client2;
  if (clientId === 0) {
    client1 = clients[0];
    client2 = clients[1];
  } else {
    client1 = clients[1];
    client2 = clients[0];
  }
  switch (msg) {
    case 'UP':
      client1.worm.direction = Direction.UP;
      break;
    case 'DOWN':
      client1.worm.direction = Direction.DOWN;
      break;
    case 'LEFT':
      client1.worm.direction = Direction.LEFT;
      break;
    case 'RIGHT':
      client1.worm.direction = Direction.RIGHT;
      break;
    default:
      throw Error(`Invalid message \"${msg}\" from client ${clientId}.`)
  }
  client2.socket.emit('message', msg);
}
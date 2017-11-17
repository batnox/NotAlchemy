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
app.use('/snake/', express.static(__dirname + '/snake/'));

app.get('/', function(req, res) {
  res.sendFile(path.resolve(__dirname + '/../index.html'));
});

io.on('connection', function(socket) {
  console.log('a user connected');
  console.log('hi');

    socket.on('direction', function(data) {
        console.log(data);

    });
  socket.on('disconnect', function(){
    console.log('user disconnected');
  });
});

http.listen(3000, function() {
  console.log('listening on *:3000');
});



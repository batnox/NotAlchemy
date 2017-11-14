const path = require('path');
const express = require('express');
const app = require('express')();
const http = require('http').Server(app);

app.use(express.static(__dirname + '/public'));
app.get('/', function(req, res) {
  res.sendFile(path.resolve(__dirname + '/../index.html'));
});

http.listen(3000, function() {
  console.log('listening on *:3000');
});
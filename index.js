
var fs = require('fs');
var https = require('https');

var express = require('express');
var app = express();

var certsPath = __dirname +'/certificates';
var people = {};

var options = {
  key: fs.readFileSync(certsPath +'/privkey.pem'),
  cert: fs.readFileSync(certsPath + '/fullchain.pem')
};

var server = https.createServer(options, app);
var io = require('socket.io')(server);

app.use('/static', express.static('static'));
app.use('/node_modules', express.static('node_modules'));

app.get('/', function(req, res) {
  res.sendFile(__dirname + '/index.html');
});

app.get('/video', function(req, res) {
  res.sendFile(__dirname + '/static/video.html');
});

io.on('connection', function(socket) {
    console.log('a user connected!!');

    socket.on('disconnect', function() {
        console.log('a disconnection!!');
    });
    
    socket.on('message', function(msg) {
        console.log('message: '+msg);
        io.emit('message', people[socket.id]+' : '+msg);
    });
    
    socket.on('stream', function(image) {
        // socket.broadcast.emit('stream',image);
        socket.emit('stream',image);
    });

    socket.on('audioStream', function(stream) {
        socket.emit('audioStream2', stream);
    });

    socket.on('join', function(username) {
        people[socket.id] = username;
        console.log('username  joined: '+username);
        username=username+' has connected to the server!!';
        io.emit('message', username);
    });
});

server.listen(3000, function() {
    console.log('server up and running at %s port', 3000);
});
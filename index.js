
var fs = require('fs');
var https = require('https');
var handlebars = require('handlebars');

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

    // user disconnection
    socket.on('disconnect', function() {
        console.log('a disconnection!!');
    });
    
    // text message
    socket.on('message', function(msg) {
        console.log('message: '+msg);
        io.emit('message', people[socket.id]+' : '+msg);
    });
    
    // video stream
    socket.on('videoStream', function(image) {
        socket.broadcast.emit('videoStreamS',image);
        // io.emit('videoStreamS', image);
    });

    socket.on('mediaEnd', function(media) {
        socket.broadcast.emit('mediaEndS', media);
    });

    // audio stream
    socket.on('audioStream', function(stream) {
        // io.emit('audioStreamS', stream);
        socket.broadcast.emit('audioStreamS', stream);
    });

    // user connection
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
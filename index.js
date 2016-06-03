var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var people={};

app.use('/static', express.static('static'));
app.get('/', function(req, res) {
    // res.send('<h1>Hello chat!!</h1>')
    res.sendFile(__dirname + '/index.html')
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
	  console.log('imageURL:' + image);
        socket.broadcast.emit('stream',image);
    });
	 socket.on('join', function(username) {
		people[socket.id] = username;
        console.log('username  joined: '+username);
		username=username+' has connected to the server!!';
        io.emit('message', username);
    });
});

http.listen(3000, function() {
    console.log('listening @ 3000');
});
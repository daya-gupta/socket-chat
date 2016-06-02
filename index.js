var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);

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
        io.emit('message', msg);
    });
});

http.listen(3000, function() {
    console.log('listening @ 3000');
});
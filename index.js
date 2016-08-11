var fs = require('fs');
var https = require('https');
var handlebars = require('handlebars');

var express = require('express');
var app = express();

var bodyParser = require('body-parser')

var certsPath = __dirname +'/certificates';
var users = [];

var options = {
  key: fs.readFileSync(certsPath +'/privkey.pem'),
  cert: fs.readFileSync(certsPath + '/fullchain.pem')
};

var server = https.createServer(options, app);
var io = require('socket.io')(server);
// var p2pserver = require('socket.io-p2p-server').Server;

// io.use(p2pserver);

function getUser(socketId) {
    console.log(socketId);
    console.log(users);
    for(var i=0; i<users.length; i++) {
        console.log(users[i].socketId);
        if(users[i].socketId==socketId) {
            return users[i];
        }
    }
}

function removeUser(socketId) {
    for(var i=0; i<users.listen; i++ ) {
        if(users[i].socketId==socketId) {
            users.splice(i,1);
        }
    }
}

function getUserByName(username) {
    for(var i=0; i<users.listen; i++) {
        if(users[i].name==username) {
            return users[i];
        }
    }
};

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

app.use('/static', express.static('static'));
app.use('/node_modules', express.static('node_modules'));

app.get('/', function(req, res) {
  res.sendFile(__dirname + '/static/login.html');
});

app.post('/index', function(req, res) {
    // console.log(req.body);
    fs.readFile(__dirname + '/index.html', function (err, data) {
       if (err) {
           return console.error(err);
       }
       // console.log("Asynchronous read:");
       var template = handlebars.compile(data.toString());
       var result = template({userName: req.body.userName});
        // console.log(result);
        res.send(result);
    });
    // var template = handlebars.compile("<p>Hello, my name is {{name}}. I am from {{hometown}}. I have " +
    //          "{{kids.length}} kids:</p>" +
    //          "<ul>{{#kids}}<li>{{name}} is {{age}}</li>{{/kids}}</ul>");
    // var template = handlebars.compile(__dirname + '/index.html');
    // var data = { "name": "Alan", "hometown": "Somewhere, TX",
    //          "kids": [{"name": "Jimmy", "age": "12"}, {"name": "Sally", "age": "4"}]};
    // var result = template(data);
    // console.log(result);
  // res.sendFile(__dirname + '/index.html?userName=' + req.body.userName);
  // res.sendFile(__dirname + '/index.html');
});

app.get('/video', function(req, res) {
  res.sendFile(__dirname + '/static/video.html');
});

app.post('/authenticateUser', function(req, res) {
    console.log(req.body.userName);
    if(req.body.userName) {
        // res.writeHead(301,{Location: 'https://localhost:3000/index'});
        res.json({success: true})
        // res.end();
    }
});

io.on('connection', function(socket) {
    // console.log(io.sockets.sockets);
    var isUserConnected = false;
    for(var userIndex=0; userIndex<users.length; userIndex++) {
        if(users[userIndex].socketId == socket.id) {
            isUserConnected = true;
            break;
        }
    }
    // if(io.sockets.sockets[socket.id]) {
    if(isUserConnected) {
        io.emit('customConnect', users);
    }
    // io.emit('message', username +' has connected to the server!!');
    console.log('a user connected!!');
    console.log(users);

    // user disconnection
    socket.on('disconnect', function() {
        console.log('a disconnection!!');
        console.log(users);
        var userDetails = getUser(socket.id);
        if(userDetails) {
            removeUser(socket.id);
        }
    });
    
    // text message
    // socket.on('message', function(msg) {
    //     console.log(msg);
    //     console.log(users);
    //     var userDetails = getUser(socket.id);
    //     console.log(userDetails);
    //     if(userDetails) {
    //         io.emit('message', userDetails.name+' : '+msg);
    //     }
    // });
    socket.on('message', function(data) {
        console.log(data);
        // console.log(users);
        // var userDetails = getUserByName(data.recipients[0]);
        var sender = getUser(socket.id);
        console.log(sender);

        if(data.recipients[0]) {
            console.log(data.recipients[0]);
            // console.log(io.sockets.name);
            // console.log(io.sockets.sockets);
            console.log(io.sockets.sockets[data.recipients[0].socketId]);
            io.sockets.sockets[data.recipients[0].socketId].emit('message', sender.name+' : '+data.message);
            // io.sockets.sockets[socket.id].emit('message', sender.name+' : '+data.message);
        }

        socket.emit('message', sender.name+' : '+data.message);
        console.log(socket);
        // console.log(io.sockets.sockets[data.socketId]);
        // if(userDetails) {
        //     io.sockets[users[1].socketId].emit('message', userDetails.name+' : '+data.message);
        // }
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
        users.push({name: username, socketId: socket.id});
        console.log(username + ' joined');
        io.emit('users', users);
        io.emit('message', username +' has connected to the server!!');
        console.log(users);
    });
});

server.listen(3000, function() {
    console.log('server up and running at %s port', 3000);
});
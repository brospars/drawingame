var express = require("express");
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);


var users = {};


app.use(express.static(__dirname + '/public'));

//Root to Angular App
app.get('/', function (req, res) {
    res.sendFile(__dirname + '/public/index.html');
});

io.use(function(socket, next){
    
    var pseudo = socket.handshake.query.pseudo;
    
    if (pseudo && pseudo.length > 2) {
        if(!isPseudoTaken(pseudo)){
            users[socket.id] = {"pseudo":pseudo};
            return next();
        }else{
            return next(new Error('Pseudo already taken'));
        }        
    }
    
    return next(new Error('Pseudo is missing or too short'));
});

io.on('connection', function (socket) {
    
    console.log('a user connected');
    console.log(users);

    socket.on('disconnect', function () {
        delete users[socket.id];
        console.log('user disconnected');
    });
    
    socket.on('chatMessage', function (msg) {
        io.emit('chatMessage', msg);
    });
    
	socket.on('mousemove', function (data) {
        //retrieve previous coordinates
        data.prevx = users[socket.id].prevx;
        data.prevy = users[socket.id].prevy;
        
		io.emit('moving', data);
        
        //store coordinates
        users[socket.id].prevx = data.x;
        users[socket.id].prevy = data.y;
	});
    
});

http.listen(1337, function () {
    console.log('listening on *:1337');
});


function isPseudoTaken(pseudo){
    var result = false;
    Object.keys(users).forEach(function(key) {
        var user = users[key];
        if(user.pseudo == pseudo){
            console.log("pseudo taken");
            result = true;
        }
    });
    return result;
}
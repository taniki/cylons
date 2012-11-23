var io = require('socket.io').listen(3010);
var cli = require('cli-color');
var _ = require('underscore');

var express = require('express');
var app = express();

io.set('log level', 0);

var crew = {};
var inactives = {};

io.sockets.on('connection', function (socket) {

	crew[socket.id] = socket;

	socket.on('crew', function(){
		socket.send(crew);
	});

	socket.on('set report', function(report){
		socket.set('report', report);
	});

	socket.on('disconnect', function(){
		delete crew[socket.id];		
	});

	socket.emit('welcome',{ name: 'basestar-1' });

	socket.on('tweet',function(data){
//		io.sockets.in('warehouse').emit('tweet', data);

	    socket.get('warehouse', function(err, room) {
//	          socket.broadcast.to(room).emit('tweet', { msg : '2' });
	          io.sockets.in(room).emit('tweet', data);
	    });

	});

	socket.on('join_room', function(room){
		socket.join(room);
	});
});

function update_crew(){
	console.log(cli.reset);

	console.log(_(crew).pluck('id'));
}

setInterval(function(){
	update_crew();	
}, 500);

app.get('/crew', function(req, res){
    res.header("Access-Control-Allow-Origin", "*");
	res.send(_(crew).pluck('id'));
});

app.get('/cylon/:socket', function(req, res){
	var cylon_socket  = req.params.socket;

	var cylon_data = {
		info  : {},
		report: {}
	};

    res.header("Access-Control-Allow-Origin", "*");

    crew[cylon_socket].get('report', function(err, report){
    	cylon_data.report = report;
   	
    	res.send(cylon_data);
    });
});

app.listen(3009);
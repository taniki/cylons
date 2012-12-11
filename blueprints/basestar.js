var cli = require('cli-color');
var _	= require('underscore');

var app = require('express')();
var server	= require('http').createServer(app);

server.listen(3010);

var io 	= require('socket.io').listen(server);

io.set('log level', 0);

var crew = {};
var inactives = {};

var collectors = [
	'keywords',
	'keywords-group'
];

var setters = [
	'report',
	'type'
];

io.sockets.on('connection', function (socket) {
	crew[socket.id] = socket;

	function registerize(m){
		var member = {
			active : false,
//			last_seen : new Date.getTime(),
			name : undefined,
			socket_id : m.id,
			type : m.store.data.type || "anonymous"
		}

		return member;		
	}

	function crew_list(){
		var c = [];

		_(crew).each(function(m){
			var member = registerize(m);

			member.active = true;

			c.push(member);
		});

		c = _(c).union(_(inactives).toArray());

		return c;
	}

	socket.on('get crew', function(){
		socket.emit("crew", crew_list());
	});

	_(collectors).each(function(collection){
		socket.on("send "+collection, function(msg){
			socket.broadcast.emit("send "+collection, msg);
		});
	});

	setters.forEach(function(s){
		socket.on('set '+s, function(setting){
			socket.set(s, setting);
		});
	});

	socket.on('disconnect', function(){
		delete crew[socket.id];

		var m = registerize(socket);

		inactives[socket.id] = m;
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

	socket.on('listen room', function(room){
		socket.join(room);
	});

});

function update_crew(){
	console.log(cli.reset);

	_(crew).each(function(c){
		console.log(c.store.data.type);
	});

//	console.log(_(crew).pluck('store.data.type'));

	// _(crew).each(function(c){
	// 	c.get('report', function(err, report){
	// 		console.log(report);
	// 	})
	// });
}

setInterval(function(){
//	update_crew();	
}, 500);
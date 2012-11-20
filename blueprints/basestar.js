var io = require('socket.io').listen(3010);

io.set('log level', 1);

io.sockets.on('connection', function (socket) {

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


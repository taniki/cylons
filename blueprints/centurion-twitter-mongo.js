var io = require('socket.io-client');
var socket = io.connect('http://localhost:3010');

var mongo = require('mongodb');

module.exports = function(personality){

	var db = new mongo.Db('twitter', new mongo.Server(personality.mongo.host, personality.mongo.port, {auto_reconnect: true}));

	this.count = 0;

	socket.on('connection', function(){
		socket.emit('join_room', 'warehouse');
	});

	db.collection('tweets', function(err,tweets){
		socket.on('tweet', function(data){
			tweets.update({ id_str : data.id_str }, data, {upsert:true }, function(err, result){
			});
		});
	});

	socket.on('welcome', function(server){
		console.log('[ '+ server.name +' ] dans la place !');
	});
}
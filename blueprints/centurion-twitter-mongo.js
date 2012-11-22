var io = require('socket.io-client');
var socket = io.connect('http://localhost:3010');
var moment = require('moment');

var mongo = require('mongodb');

module.exports = function(personality){

	var db = new mongo.Db('twitter', new mongo.Server(personality.mongo.host, personality.mongo.port, {auto_reconnect: true}));

	this.time_start = new moment();
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

	this.report = function(){
		// should tell some statistics about performance

		return {
			last_second : 0,
			last_minute : 0,
			last_hour : 0
		}
	}
}
var fs = require('fs');

var io = require('socket.io-client');
var socket = io.connect('http://localhost:3010');
var moment = require('moment');

var mongo = require('mongodb');

module.exports = function(personality){
	var _this = this;

	this.time_start = new moment();
	this.count = 0;

	fs.readFile(process.argv[2], 'utf8', function(err, content){
		  if (err) {
		    return console.log(err);
		  }

		  _this.personality = JSON.parse(content);

		  _this.start();
	});


	this.start = function(){

		var db = new mongo.Db('twitter', new mongo.Server(_this.personality.mongo.host, _this.personality.mongo.port, {auto_reconnect: true}));

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

	this.report = function(){
		// should tell some statistics about performance

		return {
			last_second : 0,
			last_minute : 0,
			last_hour : 0
		}
	}

	setInterval(function(){
		socket.emit("set report", _this.report())
	},1000);
}()
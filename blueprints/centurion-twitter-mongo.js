var model = require('./model');

var moment = require('moment');

var mongo = require('mongodb');

module.exports = function(personality){
	var _this = this;

	this.time_start = new moment();
	this.count = 0;

	this.start = function(){

		var db = new mongo.Db('twitter', new mongo.Server(_this.personality.mongo.host, _this.personality.mongo.port, {auto_reconnect: true}));

		_this.socket.on('connection', function(){
			_this.socket.emit('join_room', 'warehouse');
		});

		db.collection('tweets', function(err,tweets){
			_this.socket.on('tweet', function(data){
				tweets.update({ id_str : data.id_str }, data, {upsert:true }, function(err, result){
				});
			});
		});

		_this.socket.on('welcome', function(server){
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
		_this.socket.emit("set report", _this.report())
	},1000);

	model.call(this, process.argv[2]);	
}()
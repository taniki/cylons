var io = require('socket.io-client');
var socket = io.connect('http://localhost:3010');

var twitter = require('ntwitter');
var cli = require('cli-color');
var moment = require('moment');

module.exports = function(personality){
	var _this = this;

	this.time_start = new moment();

	this.count = 0;
	this.seconds = 0;

	console.log(cli.reset);

	console.log("uptime ");
	console.log("tweets ");
	console.log("speed");
	console.log("last");

	this.report = function(){
		// should tell some statistics about performance

		return {
			last_second : 0,
			last_minute : 0,
			last_hour : 0
		}
	}

	this.update_uptime = function(){
		process.stdout.write(cli.moveTo(8,1));

		var current = new moment();
		this.seconds = current.diff(time_start, "seconds");
		console.log(this.seconds);
		this.update_speed();
	}

	this.update_count = function(){
		process.stdout.write(cli.moveTo(8,2));
		console.log(this.count);
	}

	this.update_speed = function(){
		process.stdout.write(cli.moveTo(8,3));
		console.log(this.count / this.seconds);
	}

	setInterval(function(){
		socket.emit("set report", _this.report())
		_this.update_uptime();
	},1000);


	this.start = function(){
		var twit = new twitter(personality.credentials);

		twit.stream(
			personality.endpoint,
			personality.request,
			function(stream) {
				_this.count = 0;

				stream.on('data', function (data) {
					_this.count++;
					_this.update_count();

					socket.emit('tweet', data);

					process.stdout.write(cli.moveTo(8,4));
					console.log(data.text);

				});

				stream.on('end', function (response) {
		//			console.log('restart me');
//					_this.start();
				});

				stream.on('close', function (response) {
		//			console.log('arrgghhh');
				});

//				setTimeout(stream.destroy, 5 * 1000);
			}
		);
	}

	this.start();
}
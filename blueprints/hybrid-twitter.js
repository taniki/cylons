var model = require('./model');

var twitter = require('ntwitter');

var _ = require('underscore');

var cli = require('cli-color');
var moment = require('moment');

module.exports = function(){
	var _this = this;

	this.request = {
		track		: '',
		follow		: '',
		locations	: ' '
	}

	this.request;

	this.time_start = new moment();

	this.count = 0;
	this.seconds = 0;
	this.count_restart = 0;

	var twit;

	console.log(cli.reset);

	console.log("uptime ");
	console.log("restart");
	console.log("tweets ");
	console.log("speed");
	console.log("watch");

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
		process.stdout.write(cli.moveTo(8,3));
		console.log(this.count);
	}

	this.update_speed = function(){
		process.stdout.write(cli.moveTo(8,4));
		console.log(this.count / this.seconds);
	}

	this.report = function(){
		var results = {
			usage : {
				track    : (this.request.track.split(',')).length,
				follow	 : (this.request.follow.split(',')).length,
				locations: 0
			},
			max : {
				track    : 400,
				follow	 : 5000,
				locations: 25
			}
		};

		return results;
	}

	setInterval(function(){
		_this.socket.emit("set report", _this.report())
		_this.update_uptime();
	},1000);

	this.restart = function(){
		this.count_restart++;
		process.stdout.write(cli.moveTo(8,2));
		console.log(this.count_restart);

		_stream.destroy();
//		_stream = undefined;
 		setTimeout(this.start, 2 * 1000);
	}

	var _stream;

	this.start = function(){

		_this.request = _(_this.request).extend(_this.personality.request);
		twit = new twitter(_this.personality.credentials);

		console.log(_this.request);
		console.log(_this.personality.request);

		for(var k in _this.request){
			if (_this.request[k] == '') {
				delete _this.request[k];
			}
		}		

		console.log(_this.request);

		twit.stream(
			_this.personality.endpoint,
			_this.request,
			function(stream) {
				_this.count = 0;
				_stream = stream;

				stream.on('data', function (data) {
					_this.count++;
					_this.update_count();

					_this.socket.emit('tweet', data);

//					process.stdout.write(cli.moveTo(8,4));
//					console.log(data.text);

				});
			}
		);
	}

	model.call(this, process.argv[2], process.argv[1]);

	_this.socket.on('send keywords-group', function(kws){
		// detect change. could be done more properly
		if(	_this.request.track != kws.join(',') ){
			_this.request.track = kws.join(',');
			
			if(_stream){
				_this.reload();
			}

			console.log(_this.request);
		}
	});

}()
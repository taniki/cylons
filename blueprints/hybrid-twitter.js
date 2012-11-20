var io = require('socket.io-client');
var socket = io.connect('http://localhost:3010');

var twitter = require('ntwitter');
var cli = require('cli-color');
var moment = require('moment');

var twit = new twitter({
  consumer_key: '1nTj648YIiFJAPaZD3pw',
  consumer_secret: '6AOQ5RKzJ6Y42oKWrFpI54sX0aWaX756kb7G8YG90E',
  access_token_key: '1740241-BcveVF1tGmPBCF4CvImfuUJOToqa2N5fLuwlvb4',
  access_token_secret: 'uXaywfk1wd00fG03jM8z9UbqZxWh4liqVTh9zifISk'
});

module.exports = function(personality){
	var _this = this;

	this.time_start = new moment();

	this.count = 0;
	this.seconds = 0;

	console.log(cli.reset);

	console.log("uptime ");
	console.log("tweets ");
	console.log("speed");

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
		_this.update_uptime();
	},1000);


	twit.stream('statuses/filter',
		personality,
		function(stream) {

			stream.on('data', function (data) {
				_this.count++;
				_this.update_count();

				socket.emit('tweet', data);
			});

			stream.on('end', function (response) {
	//			console.log('restart me');
			});

			stream.on('destroy', function (response) {
	//			console.log('arrgghhh');
			});

		}
	);
}
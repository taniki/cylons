var twitter = require('ntwitter');
var cli = require('cli-color');
var moment = require('moment');

var twit = new twitter({
  consumer_key: '1nTj648YIiFJAPaZD3pw',
  consumer_secret: '6AOQ5RKzJ6Y42oKWrFpI54sX0aWaX756kb7G8YG90E',
  access_token_key: '1740241-BcveVF1tGmPBCF4CvImfuUJOToqa2N5fLuwlvb4',
  access_token_secret: 'uXaywfk1wd00fG03jM8z9UbqZxWh4liqVTh9zifISk'
});

var time_start = new moment();

var uptime;
var count = 0;
var seconds = 0;

console.log(cli.reset);

console.log("uptime:");
console.log("tweets:");
console.log("speed: ");

function update_uptime(){
	process.stdout.write(cli.moveTo(8,1));

	var current = new moment();
	seconds = current.diff(time_start, "seconds");
	console.log(seconds);
}

function update_count(){
	process.stdout.write(cli.moveTo(8,2));
	console.log(count);
	update_speed();
}

function update_speed(){
	process.stdout.write(cli.moveTo(8,3));
	console.log(count / seconds);
}

twit.stream('statuses/filter',
	{'track':'gaza'},
	function(stream) {

		stream.on('data', function (data) {
			update_count();

//			console.log(data.text);
			count++;
		});

		stream.on('end', function (response) {
//			console.log('restart me');
		});

		stream.on('destroy', function (response) {
//			console.log('arrgghhh');
		});

	}
);

setInterval(function(){
	update_uptime();
},1000);
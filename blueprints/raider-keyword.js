var io = require('socket.io-client');
var socket = io.connect('http://localhost:3010');

var _ = require('underscore');

module.exports = function(personality){

	console.log(personality.keywords);

	var keywords = personality.keywords;

	socket.on('connection', function(){
		socket.emit('join_room', 'keywords');
		socket.emit('join_room', 'warehouse');
	});

	// Collect and tag tweets
	socket.on('tweet', function(data){

		var ok = false;
		var matches = [];

		_(keywords).each(function(k){
			if(data.text.indexOf(k) != -1){

				ok = true;
				matches.push(k);

			}
		});

		if(ok){
			console.log(matches);
			console.log(data.text);
		}
	});

	setInterval(function(){
		socket.emit("send keywords", keywords);
	}, 1000);

}
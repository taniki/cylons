var io = require('socket.io-client');
var socket = io.connect('http://localhost:3010');

var _ = require('underscore');

var moment = require('moment');

module.exports = function(personality){
	var _this = this;

	var all_keywords = []

	socket.on('connection', function(){
		socket.emit('listen room', 'keywords');
	});

	socket.on('send keywords', function( kw ){
		var before = all_keywords;

		all_keywords = _(all_keywords).union(kw);

		if(before.join(',') != all_keywords.join(',')){
			console.log(all_keywords);

			socket.emit( 'send keywords-group', all_keywords );
		}

	});

	this.report = function(){
		return {
			size : _(all_keywords).size()
		}

	}

	setInterval(function(){
//		all_keywords = [];
	}, 10000);

	setInterval(function(){
		socket.emit("set report", _this.report())
		socket.emit( 'send keywords-group', all_keywords );
	}, 1000);
}
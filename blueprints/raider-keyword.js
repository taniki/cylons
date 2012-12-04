var io = require('socket.io-client');
var socket = io.connect('http://localhost:3010');

var _ = require('underscore');

module.exports = function(personality){
	var _this = this;

	console.log(personality.keywords);

	var keywords = personality.keywords;

	socket.on('connection', function(){
		socket.emit('join_room', 'keywords');
		socket.emit('join_room', 'warehouse');
	});

	this.current = {
		second  : 0,
		minute  : 0,
		hour	: 0,
		day		: 0
	}

	this.history = {
		second  : [],
		minute  : [],
		hour	: [],
		day		: []
	}

	this.restart = function(){
		
	}

	// Collect and tag tweets
	socket.on('tweet', function(data){

		var ok = false;
		var matches = [];

		var kw = _(keywords).clone();

		_(kw).each(function(k){
			kw.push("#"+k);
			kw.push("@"+k);
		});

		_(kw).each(function(k){
			if(data.text.toLowerCase().indexOf(k) != -1){

				ok = true;
				matches.push(k);
			}
		});

		if(ok){
			_this.current.second++;

			console.log(matches);
			console.log(data.text);
		}
	});

	this.report = function(){
		return {
			current : this.current,
			history : this.history
		}
	}

	setInterval(function(){
		_this.history.second.unshift(_this.current.second);
		_this.current.minute += _this.current.second;
		_this.current.second = 0;

		if(_this.history.second.length > 60 ){
			_this.history.second.pop();
		}

	}, 1000);

	setInterval(function(){
		_this.history.minute.unshift(_this.current.minute);
		_this.current.hour += _this.current.minute;
		_this.current.minute = 0;

		if(_this.history.minute.length > 60 ){
			_this.history.minute.pop();
		}

	}, 60 * 1000);

	setInterval(function(){
		_this.history.hour.unshift(_this.current.hour);
		_this.current.day += _this.current.hour;
		_this.current.day = 0;

		if(_this.history.hour.length > 24 ){
			_this.history.hour.pop();
		}

	}, 60 * 60 * 1000);

	setInterval(function(){
		_this.history.day.unshift(_this.current.day);
		_this.current.day = 0;
	}, 24 * 60 * 60 * 1000);

	setInterval(function(){
		socket.emit("set report", _this.report())
		socket.emit("send keywords", keywords);
	}, 1000);

}
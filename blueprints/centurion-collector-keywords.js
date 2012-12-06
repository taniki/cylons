var model = require('./model');

var _ = require('underscore');

var moment = require('moment');

module.exports = function(personality){
	var _this = this;

	var all_keywords = []

	this.start = function(){

		_this.socket.on('connection', function(){
			_this.socket.emit('listen room', 'keywords');
		});

		_this.socket.on('send keywords', function( kw ){
			var before = all_keywords;

			all_keywords = _(all_keywords).union(kw);

			if(before.join(',') != all_keywords.join(',')){
				console.log(all_keywords);

				_this.socket.emit( 'send keywords-group', all_keywords );
			}

		});

	}

	this.report = function(){
		return {
			size : _(all_keywords).size()
		}

	}

	setInterval(function(){
//		all_keywords = [];
	}, 10000);

	setInterval(function(){
		_this.socket.emit("set report", _this.report())
		_this.socket.emit( 'send keywords-group', all_keywords );
	}, 1000);

	model.call(this, process.argv[2]);
}()
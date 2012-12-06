var fs = require('fs');

var io = require('socket.io-client');
var socket = io.connect('http://localhost:3010');

var model = function(personality, cb){
	var _this = this;

	this.socket = socket;
	this.personality = {};

	this.load_personality = function(personality){
		var _this = this;

		fs.readFile(personality, 'utf8', function(err, content){
			  if (err) {
			    return console.log(err);
			  }

			  _this.personality = JSON.parse(content);

			  _this.start();
		});
	}

	this.reload = function(){
		process.send({
			command : "reload"
		});
	}

	this.load_personality(personality);
}




module.exports = model;
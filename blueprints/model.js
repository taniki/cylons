var fs = require('fs');

var io = require('socket.io-client');
var socket = io.connect('http://localhost:3010');

var cli = require('cli-color');

var model = function(personality, body){
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

	this.socket.on('connect', function(){
		console.log(cli.xterm(12)(' ● ') + "connected")
	});

	this.load_personality(personality);

	this.set_type = function(){
		var b = body.split("/");
		b = b[b.length - 1];
		b = b.split("-")[0];

		_this.socket.emit("set type", b);
	}();
}

module.exports = model;
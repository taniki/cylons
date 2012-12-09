var fs	 = require('fs');
var fork = require('child_process').fork;

var cli = require('cli-color');

function cylon(model, personality){
	var _this = this;

	this.model		  = model;
	this.personality  = personality;

	this.body = null;

	fs.watch(_this.personality, function(e ,f){
		_this.reload();
	});

	fs.watch(_this.model, function(e ,f){
		_this.reload();
	});

	this.start = function(){
		console.log(cli.greenBright(' ● ') + "active");

        _this.body = fork(_this.model, [personality]);

        _this.body.on('message', function(msg){
        	if(msg.command == "reload"){
        		_this.reload();
        	}
        });      
	}

	this.reload = function(){
		console.log(cli.redBright(' ● ') + "dying");

		_this.body.kill();
		_this.start();
	}
}

module.exports = cylon;
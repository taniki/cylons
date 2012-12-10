var fs	 = require('fs');
var fork = require('child_process').fork;

var cli = require('cli-color');

var moment = require('moment');

function cylon(model, personality){
	var _this = this;

	this.model		  = model;
	this.personality  = personality;

	this.body = null;

	var parts = [
		'blueprints/model.js',
		_this.personality,
		_this.model
	];

//	parts.forEach(relaunch_on_change(p));

	parts.forEach(function(p){
		fs.watch(p, function(e ,f){
			_this.reload();
		});
	});

	this.start = function(){
		console.log(cli.xterm(238)(moment().format('hh:mm:ss')) + cli.greenBright(' ● ') + "active");

        _this.body = fork(_this.model, [personality]);

        _this.body.on('message', function(msg){
        	if(msg.command == "reload"){
        		_this.reload();
        	}
        });      
	}

	this.reload = function(){
		console.log(cli.xterm(238)(moment().format('hh:mm:ss')) + cli.redBright(' ● ') + "dying");

		_this.body.kill();
		_this.start();
	}
}

module.exports = cylon;
var fs	 = require('fs');
var fork = require('child_process').fork;

function cylon(model, personality){
	var _this = this;

	this.model		  = model;
	this.personality  = personality;

	this.body = null;

	fs.watch(_this.personality, function(e ,f){
		_this.reload();
	});

	this.start = function(){
		console.log("bzz bzz");

        _this.body = fork('./blueprints/'+_this.model, [personality]);

        _this.body.on('message', function(msg){
        	if(msg.command == "reload"){
        		_this.reload();
        	}
        });      
	}

	this.reload = function(){
		console.log('dying');

		_this.body.kill();
		_this.start();
	}
}

module.exports = cylon;
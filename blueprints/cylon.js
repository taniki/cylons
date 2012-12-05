var fs = require('fs');

function cylon(model, personality){
	var _this = this;

	this.model		  = model;
	this.personality  = personality;

	this.body = null;

	this.start = function(){
		console.log("bzz bzz");

		fs.readFile(this.personality, 'utf8', function (err, personality) {
		  if (err) {
		    return console.log(err);
		  }


		  fs.watch(_this.personality, function(e ,f){
		  	_this.reload();
		  });

		  var personality = JSON.parse(personality);

          _this.body = require('./'+_this.model)(personality);
		});
	}

	this.reload = function(){
		console.log('dying');
	}
}

module.exports = cylon;
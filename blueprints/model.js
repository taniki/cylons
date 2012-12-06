var fs = require('fs');

var model = function(personality, cb){
	var _this = this;

	this.personality;

	this.load_personality(personality);
}

model.prototype.load_personality = function(personality){
	var _this = this;

	fs.readFile(personality, 'utf8', function(err, content){
		  if (err) {
		    return console.log(err);
		  }

		  _this.personality = JSON.parse(content);

		  _this.start();
	});
}


module.exports = model;
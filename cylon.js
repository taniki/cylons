#!/usr/local/bin/node

var fs = require('fs');

var model		= process.argv[2];
var identity	= process.argv[3];

// console.log(process.argv[2]);
// console.log(process.argv[3]);

function cylon(){
	var _this = this;

	this.model		= process.argv[2];
	this.identity	= process.argv[3];

	this.body = null;

	this.start = function(){
		console.log("bzz bzz");

		fs.readFile(this.identity, 'utf8', function (err, personality) {
		  if (err) {
		    return console.log(err);
		  }


		  fs.watch(_this.identity, function(e ,f){
		  	_this.reload();
		  });

		  var personality = JSON.parse(personality);

          _this.body = require('./blueprints/'+_this.model)(personality);
		});
	}

	this.reload = function(){
		console.log('dying');
	}
}

new cylon().start();
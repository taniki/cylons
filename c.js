#!/usr/local/bin/node

var cylon		= require('./blueprints/cylon.js');

var model		= process.argv[2];
var personality	= process.argv[3];

new cylon(model, personality).start();
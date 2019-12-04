'use strict';

var express = require('express');
var mongo = require('mongodb');
var mongoose = require('mongoose');
var bodyParser = require("body-parser");
var dns = require("dns");
var sha = require("sha-1");

mongoose.connect(process.env.MONGO_URI, {useNewUrlParser: true});

var cors = require('cors');

var app = express();

app.use(bodyParser.urlencoded({extended: true}));

// Basic Configuration 
var port = process.env.PORT || 3000;

app.use(cors());

app.use('/public', express.static(process.cwd() + '/public'));


// INDEX ROUTE
app.get('/', function(req, res){
  res.send("hola")
});



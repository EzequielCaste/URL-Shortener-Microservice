'use strict';

var express = require('express');
var mongo = require('mongodb');
var mongoose = require('mongoose');
var bodyParser = require("body-parser");
var dns = require("dns");
var sha = require("sha-1");
var cors = require('cors');

mongoose.connect("mongodb+srv://eze:fcc456@cluster0-py5g6.mongodb.net/test?retryWrites=true&w=majority",
                 { useUnifiedTopology: true , useNewUrlParser: true }, function(err){
  if(err) return console.log(err)
  
  console.log(mongoose.connection.readyState)
  
  
});

var linkSchema = new mongoose.Schema({
	address: String,
	hash: String
});

var Link = mongoose.model("Link",linkSchema);

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



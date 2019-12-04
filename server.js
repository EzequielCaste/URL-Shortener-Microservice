'use strict';

var express = require('express');
var mongo = require('mongodb');
var mongoose = require('mongoose');
var bodyParser = require("body-parser");
var dns = require("dns");
var sha = require("sha-1");

mongoose.connect(process.env.MONGO_URI, {useNewUrlParser: true});

console.log(mongoose.connection.readyState)


var linkSchema = new mongoose.Schema({
  url: String,
  hash: String
})

var Link = mongoose.model('Link', linkSchema);

var cors = require('cors');

var app = express();

app.use(bodyParser.urlencoded({extended: true}));

// Basic Configuration 
var port = process.env.PORT || 3000;

/** this project needs a db !! **/ 
// mongoose.connect(process.env.MONGOLAB_URI);

app.use(cors());

/** this project needs to parse POST bodies **/
// you should mount the body-parser here

app.use('/public', express.static(process.cwd() + '/public'));

app.get('/', function(req, res){
  //console.log(mongoose.connection.readyState)
  res.sendFile(process.cwd() + '/views/index.html');
});

  
// your first API endpoint... 
app.get("/api/hello", function (req, res) {
  res.json({greeting: 'hello API'});
});

app.post("/api/shorturl/new", function(req,res){
  
  // https://www.freecodecamp.org
  
  let regex = /https?:\/\//; 
  let url = req.body.url
  
  if(regex.test(url)){
    
    // string contains https:// or http://
    // splice string to remove http part
    
    dns.lookup(url.slice(url.indexOf("//")+2), function(err,res){
      if(err) return console.log(err)
      
      let id = sha(res).substring(0,7);
      
      let newAddress = {
        url: url.slice(url.indexOf("//")+2),
        hash: id
      }
      
      //console.log(newAddress)
      
      Link.create(newAddress, function(err, created){
        if(err) return console.log(err)
        
        console.log("here")
        
      })
      
       
      //
    
    })
  }
  
  
  
 
  
  
})

app.listen(port, function () {
  console.log('Node.js listening ...');
});
"use strict";

var express = require("express");
var mongo = require("mongodb");
var mongoose = require("mongoose");
var bodyParser = require("body-parser");
var dns = require("dns");
var sha = require("sha-1");
var cors = require("cors");
var path = require("path");

var app = express();

app.use(bodyParser.urlencoded({ extended: true }));

// Basic Configuration
var port = process.env.PORT || 3000;

app.use(cors());

app.use("/public", express.static(process.cwd() + "/public"));

// INDEX ROUTE
app.get("/", function(req, res) {
  res.sendFile(path.join(__dirname, "views", "index.html"));
});

app.get("/a", function(req,res){
  res.sendFile(path.join(__dirname, "views", "test.html"))
})


mongoose.connect("mongodb+srv://eze:fcc456@cluster0-py5g6.mongodb.net/test?retryWrites=true&w=majority",
                 { useUnifiedTopology: true , useNewUrlParser: true }, function(err){
  if(err) return console.log(err)
  
  return console.log(mongoose.connection.readyState)
  
  
});

let linkCounter = 0;

var linkSchema = new mongoose.Schema({
  address: String,
  ipAddress: String,
  hashId: Number
});

var Link = mongoose.model("Link",linkSchema);

app.post("/api/shorturl/new", function(req,res){
  
  //check if link already exists in db
  Link.findOne({address: req.body.url}, function(err, foundEntry){
  if(err) return console.log(err)
    
    if(foundEntry){
      console.log("found")
    } else {
      console.log("not found")
      //the link is not found in the db
      // verify that the link is a valid link
      
      let regex = /https?:\/\//; 
      let url = req.body.url
  
      if(regex.test(url)){
        
        
      
      }
    }
    
  })
})

app.listen(process.env.PORT || 3000 , function () {
  console.log('Your app is listening on port ');
});
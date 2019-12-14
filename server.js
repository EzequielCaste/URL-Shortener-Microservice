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

app.get("/api/shorturl/:id", function(req,res){
  //console.log(req.params.id)
  
  Link.findOne({hashId: req.params.id}, function(err, found){
    if(err) return console.log(err)
    
    res.redirect("https://"+found.ipAddress)
    
  })
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

let Link = mongoose.model("Link",linkSchema);


app.post("/api/shorturl/new", function(req,res){
  
  let regex = /https?:\/\//; 
  let link = req.body.url
  let correctlink = link.slice(link.indexOf("//")+2);
  
  
  if(regex.test(link)){
    //valid LINK
    //DNS Lookup
    dns.lookup(correctlink, function(err,res){
      if(err) return console.log(err)
      
            
      //console.log(newAddress)
      
      Link.find({hashId: 1}, function(err, found){
        console.log(found, "found hash")
      })
      
      Link.findOne({address: correctlink}, function(err, found){
        if(err) return console.log(err)
        
        if(found){
          console.log("found")
        } else {
          console.log("not found")
          
          
          
          let newAddress = {address: correctlink, ipAddress: res, hashId: ++linkCounter}
          
          Link.create(newAddress, function(err, created){
            if(err) return console.log(err)
            
            console.log(created, "created")
            
          })
        }
        
      })
   
    })
  }
    
    
  
})

app.listen(process.env.PORT || 3000 , function () {
  console.log('Your app is listening on port ');
});
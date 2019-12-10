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


var linkSchema = new mongoose.Schema({
  address: String,
  ipAddress: String,
  hashId: String
});

var Link = mongoose.model("Link",linkSchema);

app.post("/api/shorturl/new", function(req,res){
  
  // https://www.freecodecamp.org
  
  let regex = /https?:\/\//; 
  let url = req.body.url
  
  if(regex.test(url)){
    
    // string contains https:// or http://
    // splice string to remove http part
    
    dns.lookup(url.slice(url.indexOf("//")+2), function(err,res){
      if(err) return console.log(err)
    })
               
      // DNS lookup is OK
      //create an ID hash should be UNIQUE
      
      let id = sha(res).substring(0,7);
      let link = url.slice(url.indexOf("//")+2);
      
      let newAddress = {address: link, ipAddress: res, hashId: id}
        
      //Check if link already exists in db
      
      Link.findOne({address: newAddress.address}, function(err, foundId){
        if(err) return console.log(err)
        
        if(foundId){
           return console.log("found", foundId)
        } else {
          console.log("not found")
          //NOT FOUND of collection empty
          //Create new db entry
          Link.create(newAddress, function(err, created){
            if(err) return console.log(err)
        
            console.log("Link added to db", created) 
            
            res.redirect("/views/index.html")
            
          })
        }
    })
  }
}
)

app.listen(process.env.PORT || 3000 , function () {
  console.log('Your app is listening on port ');
});
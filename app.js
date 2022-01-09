//jshint esversion:6
const express = require("express");
const bodyParser = require("body-parser");
const date=require(__dirname+"/date.js");
const app = express();
const items=["Wake up","Take bath"];
const worklist=[];
app.set("view engine","ejs");
app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static("public"));
app.get("/", function(req, res) {
  const day=date.getDay();
  res.render("list", {listtitle:day, listitems:items });

});

app.post("/",function(req,res){
  let n=req.body.newitem;
  if(req.body.list==="Today's Work")
  {
    worklist.push(n);
    res.redirect("/work");
  }
  else{
    items.push(n);
    res.redirect("/");
  }  
});

app.get("/work",function(req,res){
   
  res.render("list",{listtitle:"Today's Work",listitems:worklist})
})
app.post("/work",function(req,res){
  
  res.redirect("/work");
})

app.listen(3000, function() {
  console.log("Server is running at 3000");
});

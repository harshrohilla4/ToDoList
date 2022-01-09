//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
//const date = require(__dirname + "/date.js");
const mongoose=require("mongoose");

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

mongoose.connect("mongodb://localhost:27017/todolistDB");

const itemsSchema={
  name:String,
};

const items=[];
const item= mongoose.model("item",itemsSchema);

const item1=new item({
  name:"Welcome to your ToDo List..!"
});
const item2=new item({
  name:"Tap + to add task"
});
const item3=new item({
  name:"Use checkbox to complete the task"
});



const defaultitems=[item1,item2,item3];

app.get("/", function(req, res) {

  item.find({},function(err,results){

    if(results.length===0)
    {
      item.insertMany(defaultitems,function(err){
      if(err)
       {
        console.log(err);
       }
      else
       {
        console.log("Successfully added");
       }
    }); 
    res.redirect("/");
    }
    else{
    res.render("list", {listTitle:"Today", newListItems: results});
    } 
  });
});

app.post("/", function(req, res){

  
  const itemName = req.body.newItem;
  const newitem= new item({
    name:itemName
  })
 
  newitem.save();
  res.redirect("/");
});

app.post("/delete",function(req,res){
  
  const checkeditemdelete=req.body.checkbox;
  item.findByIdAndRemove(checkeditemdelete,function(err){
    if(err){
      console.log(err);
    }
    else{
      console.log("checked Item deleted");
    }
  })
  res.redirect("/");
})

app.get("/work", function(req,res){
  res.render("list", {listTitle: "Work List", newListItems: workItems});
});

app.get("/about", function(req, res){
  res.render("about");
});

app.listen(3000, function() {
  console.log("Server started on port 3000");
});

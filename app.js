//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");

const _=require("lodash");

const app = express();

app.set("view engine", "ejs");

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

mongoose.connect("mongodb://localhost:27017/todolistDB");

const itemsSchema = {
  name: String,
};

const items = [];
const item = mongoose.model("item", itemsSchema);

const item1 = new item({
  name: "Welcome to your ToDo List..!",
});
const item2 = new item({
  name: "Tap + to add task",
});
const item3 = new item({
  name: "Use checkbox to complete the task",
});

const defaultitems = [item1, item2, item3];

app.get("/", function (req, res) {
  item.find({}, function (err, results) {
    if (results.length === 0) {
      item.insertMany(defaultitems, function (err) {
        if (err) {
          console.log(err);
        } else {
          console.log("Successfully added");
        }
      });
      res.redirect("/");
    } else {
      res.render("list", { listTitle: "Today", newListItems: results });
    }
  });
});

app.post("/", function (req, res) {
  const itemName = req.body.newItem;
  const listname = req.body.list;
  const newitem = new item({
    name: itemName,
  });

  if (listname === "Today") {
    newitem.save();
    res.redirect("/");
  } else {
    List.findOne({name:listname},function(err,foundlist){
      foundlist.items.push(newitem);
      foundlist.save();
      res.redirect("/"+listname);

    })
  }
});
const listSchema = {
  name: String,
  items: [itemsSchema],
};

const List = mongoose.model("List", listSchema);

app.get("/:customListname", function (req, res) {
  const customListname =_.capitalize(req.params.customListname);

  List.findOne({ name: customListname }, function (err, foundlist) {
    if (!err) {
      if (!foundlist) {
        const list = new List({
          name: customListname,
          items: defaultitems,
        });
        list.save();
        res.redirect("/" + customListname);
      } else {
        res.render("list", {
          listTitle: foundlist.name,
          newListItems: foundlist.items,
        });
      }
    }
  });
});

app.post("/delete", function (req, res) {
  const checkeditemdelete = req.body.checkbox;
  const listname=req.body.Listname;

  if(listname==="Today"){
  item.findByIdAndRemove(checkeditemdelete, function (err) {
    if (err) {
      console.log(err);
    } else {
      console.log("checked Item deleted");
    }
  });
  res.redirect("/");
  } else{
     List.findOneAndUpdate({name:listname},{$pull:{items: {_id:checkeditemdelete}}},function(err,foundlist){
       if(!err)
       {
         res.redirect("/"+listname);
       }
     }
     );
  }
});

app.listen(3000, function () {
  console.log("Server started on port 3000");
});

//  John Conor Kenny API

//  Need these to work
var express = require('express');
var sqlite3 = require('sqlite3').verbose();
var bodyparser = require('body-parser');
var fs = require('fs');
var app = express();
app.use(bodyparser.json()); // support json encoded bodies
app.use(bodyparser.urlencoded({ extended: true }));

//  Reads in the .json files
var households = JSON.parse(fs.readFileSync('households.json','utf8'))
var roadaccidents = JSON.parse(fs.readFileSync('RoadAccidents.json','utf8'))

//  Creating the Database
var db = new sqlite3.Database(':memory:');
db.serialize(function()
{
  //  Creating the first table for the households that have access to cars in 2011
  db.run('CREATE TABLE households (Hid INTEGER PRIMARY KEY AUTOINCREMENT, ID REAL, County TEXT, Households REAL)');
  var stmt = db.prepare('INSERT INTO households (ID,County,Households) VALUES (?,?,?)');
  for (var i = 0; i < households.length; i++)
  {
      stmt.run(households[i].ID
               , households[i].County
               , households[i].Households
              );
  }
  stmt.finalize();
  //  Creating the second Database for the amount of road accidents in 2011
  db.run('CREATE TABLE roadaccidents (RAid INTEGER PRIMARY KEY AUTOINCREMENT, ID REAL, County TEXT, Deaths REAL, Injuries REAL)');
  var stmt = db.prepare('INSERT INTO roadaccidents (ID,County,Deaths,Injuries) VALUES (?,?,?,?)');
  for (var i = 0; i < roadaccidents.length; i++)
  {
      stmt.run(roadaccidents[i].ID
               , roadaccidents[i].County
               , roadaccidents[i].Deaths
               , roadaccidents[i].Injuries
              );
  }
  stmt.finalize();

  //  Test of both tables to the console
  db.each("SELECT households.*, roadaccidents.* FROM households INNER JOIN roadaccidents ON households.County = roadaccidents.County", function(err, row){
    console.log("In county " + row.County + " there were " + row.Households + " that had cars." + " There were " + row.Deaths + " fatalaties, and " + row.Injuries + " injuries in 2001.");
  });
});

//  Pushes the result to the browser
//
var posts = [];
db.serialize(function() {
    db.each("SELECT * FROM households", function(err, row) {
        posts.push({County: row.County, ID: row.ID, Households: row.Households})
    }, function() {
    })
})

app.get('/', function(req, res){
  res.send(posts);
});

app.get('/', function(req, res){
  res.send(posts);
});

//db.close();
var server = app.listen(8000);

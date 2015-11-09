//  John Conor Kenny API

var express = require('express');
var sqlite3 = require('sqlite3').verbose();
var fs = require('fs');

var households = JSON.parse(fs.readFileSync('households.json','utf8'))
var roadaccidents = JSON.parse(fs.readFileSync('RoadAccidents.json','utf8'))

var db = new sqlite3.Database(':memory:');
db.serialize(function()
{
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

  db.each("SELECT households.*, roadaccidents.* FROM households INNER JOIN roadaccidents ON households.County = roadaccidents.County", function(err, row){
      console.log("In county " + row.County + " there were " + row.Households + " that had cars." + " There were " + row.Deaths + " fatalaties, and " + row.Injuries + " injuries in 2001.");
  });
});

db.close();

var app = express();
app.get('/', function(req, res) {
  res.send("This my API.");
});

var server = app.listen(8000);

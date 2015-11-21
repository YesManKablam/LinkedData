//  John Conor Kenny API

//  Need these to work
var express = require('express');
var sqlite3 = require('sqlite3').verbose();
var bodyparser = require('body-parser');
var prompt = require('prompt');
var fs = require('fs');
var app = express();
var path = require("path");
//var jsonParser = bodyParser.json();
app.use(bodyparser.json()); // support json encoded bodies
app.use(bodyparser.urlencoded({ extended: true }));

//  Reads in the .json files
//================================================================
var households = JSON.parse(fs.readFileSync('households.json','utf8'))
var roadaccidents = JSON.parse(fs.readFileSync('RoadAccidents.json','utf8'))
//================================================================

//  Creating the Database
//================================================================
var db = new sqlite3.Database(':memory:');
db.serialize(function()
{
  //  Creating the first table for the households that have access to cars in 2011
  //================================================================
  db.run('CREATE TABLE households (ID TEXT, County TEXT, Households REAL)');
  var stmt = db.prepare('INSERT INTO households (ID,County,Households) VALUES (?,?,?)');
  for (var i = 0; i < households.length; i++)
  {
      stmt.run(households[i].ID
               , households[i].County
               , households[i].Households
              );
  }
  stmt.finalize();
  //================================================================

  //  Creating the second Database for the amount of road accidents in 2011
  //================================================================
  db.run('CREATE TABLE roadaccidents (ID REAL, County TEXT, Deaths REAL, Injuries REAL)');
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
  //================================================================

  //  Test of both tables to the console
  db.each("SELECT households.*, roadaccidents.* FROM households INNER JOIN roadaccidents ON households.County = roadaccidents.County", function(err, row){
    console.log("In county " + row.County + " there were " + row.Households + " that had cars." + " There were " + row.Deaths + " fatalaties, and " + row.Injuries + " injuries in 2001.");
  });
});


// Testing User input via Prompt package
//================================================================
prompt.start();   //  Starts the prompt

prompt.get(['id', 'cty', 'house'], function(err, result){
  if (err) { return onErr(err); }
  console.log('You typed in: ' + result.id + ' ' + result.cty + ' ' + result.house);
  db.all("INSERT INTO households (ID, County, Households) VALUES ('"+result.id+"', '"+result.cty+"', '"+result.house+"')", function(err, row) {
    //res.sendStatus("DELETED");
  })
});

function onErr(err){
  console.log(err);
  return 1;
}

//================================================================

//  Pushes to browser using JSON
app.get('/accessToCars', function(req, res){
  db.all("SELECT * FROM households", function(err, row) {
    rowString = JSON.stringify(row, null, '\t');
    res.sendStatus(rowString);
  })
})

app.get('/allRoadAccidents', function(req, res){
  db.all("SELECT * FROM roadaccidents", function(err, row) {
    rowString = JSON.stringify(row, null, '\t');
    res.sendStatus(rowString);
  })
})

app.get('/cty/:cty', function(req, res){
    db.all('SELECT households.*, roadaccidents.* FROM households, roadaccidents ON households.County = roadaccidents.County AND (households.County LIKE "Galway")', function(err, row){
    //WHERE County LIKE "' + req.params.cty + '"',
      rowString = JSON.stringify(row, null, '\t');
      res.sendStatus(rowString);
    })
})

app.get('/delete/:cty', function(req, res){
    console.log("ABOUT TO DELETE");
    db.serialize(function(){
      db.all('DELETE FROM households WHERE County LIKE "' + req.params.cty + '"',  function(err, row){
        console.log("DELETED");
        res.sendStatus("DELETED " + req.params.cty);
      })
    })
})

var server = app.listen(8000);

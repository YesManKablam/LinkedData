//  John Conor Kenny API

//  Need these to work
var express = require('express');
var sqlite3 = require('sqlite3').verbose();
var bodyparser = require('body-parser');
var prompt = require('prompt');
var fs = require('fs');
var app = express();
var path = require("path");
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
});
//================================================================


// Database editing using prompts go here
//================================================================
prompt.start();     //  Start the prompt package


console.log("Welcome to the Road accidents API. If you wish to enter a new record, please prease 1. If you wish to delete a record, please press 2.");      //  Welcome message
menu();     //  Calls the top menu function

function menu(){
  console.log("If you wish to enter a new record, please prease 1. If you wish to delete a record, please press 2.");
  prompt.get(['choice'], function(err, result){     //  Starts up the prompt and waits for an input
    if (result.choice == 1){
      newEntry();     //  If the new record option is selected, the newEntry Function will be started.
    }
    else if(result.choice == 2){
      del();      //  If the new record option is seleceted, the del Function will be started.
    }
  });
}

function newEntry(){
  console.log("If you wish to add to the Households table, press 1. If you wish to add to the Road Accidents table, press 2.");
  prompt.get(['choice'], function(err, result){
    if (result.choice == 1) {
      newHousehould();    //  Same as above menu, but now for which table to update. This points to the households table
    }
    else if (result.choice == 2) {
      newRoadAccidents();     //  Same as above. This points to the roadAccidents table.
    }
  });
}

function newHousehould() {
  console.log("Please enter the ID, County name, and the number of households that have access to cars");
  prompt.get(['id', 'county', 'number'], function(err, result){
    if (err) { return onErr(err); }
    console.log('You typed in: ' + result.id + ' ' + result.county + ' ' + result.house);
    db.all("INSERT INTO households (ID, County, Households) VALUES ('"+result.id+"', '"+result.county+"', '"+result.number+"')", function(err, row) {     //  Will insert the user's ID, County and Households input to the households table.
      menu();     //  Calls the top level menu so that more items may be deleted or added.
    })
  });
}

function newRoadAccidents() {
  prompt.get(['id', 'county', 'deaths', 'injuries'], function(err, result){
    if (err) { return onErr(err); }
    console.log('You typed in: ' + result.id + ' ' + result.county + ' ' + result.deaths + ' ' + result.injuries );
    db.all("INSERT INTO roadAccidents (ID, County, Deaths, Injuries) VALUES ('"+result.id+"', '"+result.county+"', '"+result.deaths+"', '"+result.injuries+"')", function(err, row) {     //  Same as above, but with ID, County, Deaths, and Injuries into the roadAccidents table.
      menu();     //  Calls the top level menu.
    })
  });
}

function del(){     //  This is really the same as the newEntry() function, but for the delete table.
  console.log("If you wish to delete from the Households table, press 1. If you wish to delete from the Road Accidents table, press 2.");
  prompt.get(['choice'], function(err, result){
    if (result.choice == 1){
      delHouseholds();
    }
    else if(result.choice == 2){
      delAccidents();
    }
  })
}

function delHouseholds(){
  console.log("Which county do you want to delete from the households table?");
  prompt.get(['County'], function(err, result){
    if (err) { return onErr(err); }
    db.serialize(function(){
      db.each('DELETE FROM households WHERE County LIKE "' + result.County + '"',  function(err, row){    //  This will delete all the data that is associated with the selected County from the households table.
      })
    })
    menu();
  });
}

function delAccidents(){
  console.log("Which county do you want to delete from the roadAccidents table?");
  prompt.get(['County'], function(err, result){
    if (err) { return onErr(err); }
    db.serialize(function(){
      db.each('DELETE FROM roadAccidents WHERE County LIKE "' + result.County + '"',  function(err, row){     //  Same as above, but from the roadAccidents table.
      })
    })
  });
  menu();
}

function onErr(err){
  console.log(err);
  menu();
}

//================================================================

//  Pushes to browser using JSON
//================================================================
app.get('/', function(req, res){
  db.all("SELECT households.*, roadaccidents.* FROM households INNER JOIN roadaccidents ON households.County = roadaccidents.County", function(err, row){     //  Get's everything from both tables, joining them by County
    output = JSON.stringify(row, null, '\t');      // Converts the ouptu string from above into JSON and adds a tab space for formating.
    res.sendStatus(output);     //  Outputs the converted data to the screen
  })
})

app.get('/accessToCars', function(req, res){
  db.all("SELECT * FROM households", function(err, row) {     //  This just selects the households table and then converts it to JSOn before writing it out to the screen.
    output = JSON.stringify(row, null, '\t');
    res.sendStatus(output);
  })
})

app.get('/allRoadAccidents', function(req, res){
  db.all("SELECT * FROM roadaccidents", function(err, row) {    //  Same as above really, but for the roadAccidents table.
    output = JSON.stringify(row, null, '\t');
    res.sendStatus(output);
  })
})

app.get('/cty/:cty', function(req, res){
    db.all('SELECT households.*, roadaccidents.* FROM households, roadaccidents ON households.County = roadaccidents.County AND (households.County LIKE "'+req.params.cty+'")', function(err, row){     //  This will return only the requested county from both tables and then converts and display the result.
    //WHERE County LIKE "' + req.params.cty + '"',
      output = JSON.stringify(row, null, '\t');
      res.sendStatus(output);
    })
})

var server = app.listen(8000);

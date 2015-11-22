# Linked Data and Semantic Web #
**John Conor Kenny**

My aim for this project is to create and API which will display the number of households that own cars and the number of accidents on the road by county in 2011. You will be able to request results from the entire country, or each county individually, e.g. http://roadstatsAPI/county/all or http://roadstatsAPI/county/galway.

##How To Use##
Run the cars.js file using node through a terminal/console. You'll need to have express, sqlite3, body-parser, prompt and fs installed to make sure everything runs okay. Upon running, your terminal/console will look a little like this:
![alt tag](https://madokami.com/7gdtpd.png)

You can then access the data through a web browser, or add and delete entries from this command menu.
For Add and Delete, just follow the terminal instructions as they'll guide you through it.

##How to Query##
After cars.js has been ran, head on over to http://127.0.0.1:8000/. You should see this in your browser window.
![alt tag] (https://madokami.com/9kzl3u.png)

This will give you the entire contents of the database. If you want to call more specific information, you can. Look bellow for examples.

Address                                   | Result
-------------                             | -------------
http://127.0.0.1:8000/accessToCars        | Show all houses that had access to cars in 2011 by county.
http://127.0.0.1:8000/allroadaccidents    | Shows the number of deaths and injuries on the road in 2011 by county
http://127.0.0.1:8000/cty/                | Returns the result of that specific county's data for whatever county is enetered after the /cty/. **The county needs to start with a capital letter**. Look bellow for a example.

![alt tag] (https://madokami.com/u5722b.png)

As you can see here, if you enter in Carlow, you get the combined data for just Carlow.

##Datasets##
The datasets are from the RSA and the CSO Statbank. The 2011 census has a separate section on each household's access to a car. The RSA has a small dataset of the amount of road accidents in 2011, which includes injuries and deaths. The datasets have been uploaded here. The RSA set is in .pdf format, so the data will have to be extracted from there and converted to a more usable format.

Bellow is each update to the project and what was changed.

##Update 1: In the Beginning...##
Striped down the CSO dataset to only list counties. Some counties were split into different areas and some also had the towns. I merged those instances together so that it can be used in for this API.

Took the data from the RSA .pdf and wrote a .json file using that data. Also converted the CSO file from a .tsv to a .json so that it can be used.

##Update 2: Electric Boogaloo##
Created the basic .js file for the API. It creates a database and two tables from the datasets and then joins them.

##Update 3: The Big One##
Update was around 2 weeks in the making.

The API can now display all the data out to the user in JSON. Originally it was being displayed through an array, but it was unformated and a mess to read. JSON works better, so that's why it's being used. Currently you can request the data from each table through express, going to set up a join for both of them in the next update.

Another request will return an individual County from both of the tables. Right now it just returns the info for Galway, but that was set that way for testing. It'll be changed over to accept the user's requested county.

Next request is to delete the requested County from the database. Right now, it'll only delete from one table, but that can be changed with another join.

Last thing is the add function. Using the console window, you can add a new entry to the households dataset. The console is being used because I don't think the end user should be able to access this function, so it should only be accessable by the person running the server.

##Update 4: The one I couldn't call UPDATEAMANIA for legal reasons.##
Added a menu to the console. It will allow you to either add a new entry, or delete an entry. It also allows you to select which table you are added or deleting from. Using the system's error handling, it can drop you back to the top of the menu if something foes wrong, however the way it works for the multiple choices is a little funky, so it only really works for the entry/deletion parts, e.g. if you were to press CTRL + C when deleting something from the table, it'll tell you that you canceled and then prompt you with the original options.

Setup proper JOINs for the individual entry request. Also added a default route that displays everything.

##Update 5: Just Because You're Paranoid, Doesn't Mean They Aren't Out to Get You##
Big update to the README.md file. It now includes a guide on how to use the API. Also changed a very small part of the cars.js file. I noticed that one of the entry options didn't tel you what it wanted. Simple fix there. Also deleted a commented out line of coded that was there for test. 

This should be the final update. Good. I'm running out of names for these things.

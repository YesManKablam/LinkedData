# Linked Data and Semantic Web
**John Conor Kenny**

My aim for this project is to create and API which will display the number of households that own cars and the number of accidents on the road by county in 2011. You will be able to request results from the entire country, or each county individually, e.g. http://roadstatsAPI/county/all or http://roadstatsAPI/county/galway.

#Datasets
The datasets are from the RSA and the CSO Statbank. The 2011 census has a separate section on each household's access to a car. The RSA has a small dataset of the amount of road accidents in 2011, which includes injuries and deaths. The datasets have been uploaded here. The RSA set is in .pdf format, so the data will have to be extracted from there and converted to a more usable format.

#Update 1: In the Beginning...
Striped down the CSO dataset to only list counties. Some counties were split into different areas and some also had the towns. I merged those instances together so that it can be used in for this API.

Took the data from the RSA .pdf and wrote a .json file using that data. Also converted the CSO file from a .tsv to a .json so that it can be used.

#Update 2: Electric Boogaloo
Created the basic .js file for the API. It creates a database and two tables from the datasets and then joins them.

#Update 3: The Big One
Update was around 2 weeks in the making.

The API can now display all the data out to the user in JSON. Originally it was being displayed through an array, but it was unformated and a mess to read. JSON works better, so that's why it's being used. Currently you can request the data from each table through express, going to set up a join for both of them in the next update.

Another request will return an individual County from both of the tables. Right now it just returns the info for Galway, but that was set that way for testing. It'll be changed over to accept the user's requested county.

Next request is to delete the requested County from the database. Right now, it'll only delete from one table, but that can be changed with another join.

Last thing is the add function. Using the console window, you can add a new entry to the households dataset. The console is being used because I don't think the end user should be able to access this function, so it should only be accessable by the person running the server.

#Update 4: The one I couldn't call UPDATEAMANIA for legal reasons.

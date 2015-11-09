# Linked Data and Semantic Web
**John Conor Kenny**

My aim for this project is to create and API which will display the number of households that own cars and the number of accidents on the road by county in 2011. You will be able to request results from the entire country, or each county individually, e.g. http://roadstatsAPI/county/all or http://roadstatsAPI/county/galway.

#Datasets
The datasets are from the RSA and the CSO Statbank. The 2011 census has a separate section on each household's access to a car. The RSA has a small dataset of the amount of road accidents in 2011, which includes injuries and deaths. The datasets have been uploaded here. The RSA set is in .pdf format, so the data will have to be extracted from there and converted to a more usable format.

#Update 1
Striped down the CSO dataset to only list counties. Some counties were split into different areas and some also had the towns. I merged those instances together so that it can be used in for this API.

Took the data from the RSA .pdf and wrote a .json file using that data. Also converted the CSO file from a .tsv to a .json so that it can be used.

# Steps to Generate and Load Data

## Generate data:
- Run "generate_json/generate.py"
- The generated documents are created under "/buildings" directory.
- This might take a few minutes to complete

## Convert the generated JSON to CSV
- Run "json_to_sql/json2sql.py"
- The generated CSV files will be stored under export
- copy the outputed sql to a file.

## Convert CSV to Cypher
- copy the csv files to the import location of Neo4J
- run the cypher commands in "importneo.cypher"


## Loading Data:
- Edit the connection parameters and Run "push_data.sh". This pushes the generated json into MongoDB Atlas
- Run the saved SQL file from step 2 to load data into Postgres.
for file in ./buildings/*.json; 
do
  /usr/local/Cellar/mongodb/4.0.3_1/bin/mongoimport --uri "mongodb+srv://vijaynv:M.pass.123.word@testcluster-bolow.mongodb.net/test?retryWrites=true" --collection buildings --file $file
done
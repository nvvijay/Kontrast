const MongoClient = require('mongodb').MongoClient;
const uri = "mongodb+srv://vijaynv:M.pass.123.word@testcluster-bolow.mongodb.net/test?retryWrites=true&w=majority";
// const client = new MongoClient(uri, { useNewUrlParser: true });

const dbName = "test";

function getHelp(req, res, next) {
  possibleOps = {
    get_list: "get all entries",
    get: "get",
    put: "insert",
    post: "update",
    delete: "delete"
  }
  res.send(JSON.stringify(possibleOps));
}

function getList(req, res, next) {
  console.log("connecting with query", req.query);
  MongoClient.connect(uri, (err, client) => {
  if (err) throw err;
  const collection = client.db(dbName).collection("buildings");
  // perform actions on the collection object
  collection.find({"name":{'$regex': '.*'+req.query['name']+'.*'}}, { projection: { "_id": 1, "name": 1}}).limit(10).sort({"name":1}).toArray( (err, items) => {
    res.json(items);
  });
  client.close();
  });
}

function getById(req, res, next) {
    console.log("req params:", req.params);
    MongoClient.connect(uri, (err, client) => {
    if (err) throw err;
    const collection = client.db(dbName).collection("buildings");
    // perform actions on the collection object
    collection.find({"_id":parseInt(req.params['id'])}).toArray( (err, items) => {
      res.json(items);
    });
    client.close();
  });
}

function updateItem(req, res, next) {
  console.log("post req params:", req.body);
  var key = req.body.key;
  var val = req.body.value;

  MongoClient.connect(uri, (err, client) => {
    if (err) throw err;
    const collection = client.db(dbName).collection("buildings");
    // perform actions on the collection object
    collection.update({"_id":parseInt(req.params['id'])}, {"$set": {[key]: val}}, (err, items) => {
      if(err) throw err;
      res.json(items);
    });
    client.close();
  });
}


function deleteItem(req, res, next) {
  console.log("delete req params:", req.body);
  var key = req.body.key;
  var val = req.body.value;

  MongoClient.connect(uri, (err, client) => {
    if (err) throw err;
    const collection = client.db(dbName).collection("buildings");
    // perform actions on the collection object
    collection.update({"_id":parseInt(req.params['id'])}, {"$unset": {[key]: val}}, (err, items) => {
      if(err) throw err;
      res.json(items);
    });
    client.close();
  });
}


function updateAddKey(req, res, next) {
  var key = req.body.key;
  var val = req.body.value;

  MongoClient.connect(uri, (err, client) => {
    if (err) throw err;
    const collection = client.db(dbName).collection("buildings");
    // perform actions on the collection object
    collection.updateOne({"_id":parseInt(req.params['id'])}, {[key]: val}, (err, items) => {
      if(err) throw err;
      res.json(items);
    });
    client.close();
  });
}


function getBusinessInfo(req, res, next){
  console.log(req.query["type"], req.params["id"]);
  var type = req.query["type"];
  var query = "";
  if(type === "spaces_list"){
    query = [{ $match: {"_id": parseInt(req.params['id'])} },
      { $unwind: "$site.building.floor"},
      { $unwind: "$site.building.floor.spaces"}, 
      { $group: {
        _id: "$_id", 
        spaces: {$push: "$site.building.floor.spaces"},
        area: {$sum: "$site.building.floor.spaces.carpet_area"},
        num_floors: {$first: "$site.building.num_floors"}
        }
      }];
  } else {
    res.send({
      "error": {
        "code": 100404,
        "message": "unknown operation!"
      }
    });
    return;
  }

  MongoClient.connect(uri, (err, client) => {
    if (err) throw err;
    const collection = client.db(dbName).collection("buildings");
    // perform actions on the collection object
    collection.aggregate(query).toArray((err, items) => {
      if(err) throw err;
      res.send(items);
    });
    client.close();
  });

}

module.exports = {
	"getHelp": getHelp,
	"getList": getList,
	"getById": getById,
  "updateItem": updateItem,
  "deleteItem": deleteItem,
  "getBusinessInfo": getBusinessInfo
};
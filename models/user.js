var util = require("util");
var mongoClient = require('mongodb').MongoClient;
//var newEvent = require('./models/event.js');

//var url = 'mongodb://localhost:27017/328final';
var mongoDB; // The connected database
// Use connect method to connect to the Server


var connection_string = 'mongodb://127.0.0.1:27017/328final';
// if OPENSHIFT env variables are present, use the available connection info:
if(process.env.OPENSHIFT_MONGODB_DB_PASSWORD){
  connection_string = process.env.OPENSHIFT_MONGODB_DB_USERNAME + ":" +
  process.env.OPENSHIFT_MONGODB_DB_PASSWORD + "@" +
  process.env.OPENSHIFT_MONGODB_DB_HOST + ':' +
  process.env.OPENSHIFT_MONGODB_DB_PORT + '/' +
  process.env.OPENSHIFT_APP_NAME;
}

mongoClient.connect(connection_string, function(err, db) {
  if (err) throw err;
  console.log("Connected correctly to server");
  // db.createCollection("User", function(err, collection){
  // 	if(err) throw err;


  // })
	mongoDB = db;
});

exports.insert = function(collection, query, callback) {
	console.log("inside the model insert function");
    mongoDB.collection(collection).insert(
      query,
      {safe: true},
      function(err, crsr) {
        if (err) throw err;
        callback(err, crsr);
      });
}

exports.findOne = function(collection, query, callback){
	console.log("findOne function query: " + JSON.stringify(query));
	console.log("findOne function coll: " + JSON.stringify(collection));

  mongoDB.collection(collection).find(query).toArray(function(err,res)
   {
      if(err) throw err;
      if(res.length==0){
        console.log("into Null find")
         callback(err, null);
      }else{
        console.log("findOne function res is" + JSON.stringify(res[0]));
         callback(err, res[0]);
      }
   });
}

exports.addEvent = function(userId, eventId, eventName, callback){
  console.log("//////inside add Event: " + userId, eventId, eventName)
  mongoDB.collection('user').findAndModify(
    {id:userId}, [],
    {$push:{events:{event_id: eventId, event_name: eventName}}},{
      upsert:true,
      new:true
    },function(err, res){
      console.log("////res in callback is" + JSON.stringify(res));
    if(err)throw err;
    callback(res);

  });
}
 // exports.findOrCreate = function(collection, query, newQuery, callback) {
 //         mongoDB.collection(collection).update(
 //         	query,
 //         	{
 //         		$setOnInsert:newQuery
 //         	},
 //             {
 //               upsert: true, 
 //                 new:true
 //             }, function(err, crsr) {
 //               if (err) doError(err);
 //               callback(crsr);
 //         });
 //   }

// exports.findOrCreate = function(collection, query, callback){
// 	var crsr = mongoDB.collection(collection).find(query);
// 		crsr.toArray(function(err, docs){
// 			console.log("docs: " + JSON.stringify(docs));
// 			if(err){
// 				var newUser = {id: docs.id, displayName: docs.displayName, email:docs.emails[0].value };
// 				mongoDB.collection(collection).insert(newUser);
// 				callback(newUser);
// 			}
// 			callback(docs);

// 		})
// }



var doError = function(e) {
  console.log("inside error");
        util.debug("ERROR: " + e);
        throw new Error(e);
    }



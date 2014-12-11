var util = require("util");
var user = require('./user.js');
var mongoClient = require('mongodb').MongoClient;

//var url = 'mongodb://localhost:27017/328final';

// default to a 'localhost' configuration:
var connection_string = 'mongodb://127.0.0.1:27017/328final';
// if OPENSHIFT env variables are present, use the available connection info:
if(process.env.OPENSHIFT_MONGODB_DB_PASSWORD){
  connection_string = 'mongodb://' + process.env.OPENSHIFT_MONGODB_DB_USERNAME + ":" +
  process.env.OPENSHIFT_MONGODB_DB_PASSWORD + "@" +
  process.env.OPENSHIFT_MONGODB_DB_HOST + ':' +
  process.env.OPENSHIFT_MONGODB_DB_PORT + '/' +
  process.env.OPENSHIFT_APP_NAME;
}

var mongoDB; // The connected database
// Use connect method to connect to the Server
mongoClient.connect(connection_string, function(err, db) {
  if (err) doError(err);
  console.log("Connected correctly to server");
  mongoDB = db;
});




// INSERT
exports.insert = function(collection, query, callback) {
        console.log("start insert");
        console.log("collection is " + collection + " and query is " + JSON.stringify(query));
        mongoDB.collection(collection).insert(
          query,
          {safe: true},
          function(err, crsr) {
            if (err) doError(err);
            callback(crsr);
            console.log("done with insert callback");
          });
        console.log("leaving insert");
}

// FIND
exports.find = function(collection, query, callback) {
	console.log("inside event find function");
        var crsr = mongoDB.collection(collection).find(query);
        crsr.toArray(function(err, docs) {
          if (err) doError(err);
          console.log('event find callback docs : ' + JSON.stringify(docs));
          callback(docs);
        });
}

// // UPDATE
// exports.update = function(collection, query, callback) {
// 	console.log("inside update function and query.find is " + JSON.stringify(query.find) + " and query.update is " + JSON.stringify(query.update));
//           mongoDB.collection(collection).update(
// 			JSON.parse(query.find), 
// 			JSON.parse(query.update), { 
//               upsert: true
//             }, function(err, crsr) {

//             	//console.log("crsr is " + crsr);
//             	//memberUpdate(crsr);
//               if (err) doError(err);
//               callback('Update succeeded');
//         });
// }



exports.update = function(collection, query, user, callback) {
	console.log("inside update function and query.find is " + JSON.stringify(query.find) + " and query.update is " + JSON.stringify(query.update));
          mongoDB.collection(collection).findAndModify(
          	JSON.parse(query.find),[],
          	JSON.parse(query.update),{
          	upsert:true,
          	new:true
          }, function(err, crsr) {
    //       		console.log("user " + JSON.stringify(user));
    //       		mongoDB.collection('user').findAndModify(
				//     {id:user.id}, [],
				//     {$push:{events:{event_id: crsr.id, event_name: crsr.name}}},{
				//       upsert:true,
				//       new:true
				//     }
				// )
	           	console.log("crsr in event update is " + JSON.stringify(crsr));
            	//memberUpdate(crsr);
              if (err) doError(err);
              console.log("CALLING THE CALLBACK");
              return callback(crsr);
        });

}

//db.people.update(
//    { name: "Andy" },
//    {
//       name: "Andy",
//       rating: 1,
//       score: 1
//    },
//    { upsert: true }
// )
function memberUpdate(query){
	console.log("current user.id is " + user.id + " and event id is " + query.id);
	//mongoDB.collection('event').update(query, {$set:{member:[user.id]}});
//	mongoDB.collection('user').update({id:user.id}, {$set:{events:[query.id]}})
}

var doError = function(e) {
        util.debug("ERROR: " + e);
        throw new Error(e);
    }

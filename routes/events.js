var mongo = require('../models/event.js');
var gcal = require('google-calendar');

// exports.importgCal = function(req, res){
// 	res.render('meeting', {meeting:res.user});
// }

exports.mongo = function(req, res){
 	//console.log("req in user.js : " + JSON.stringify(req));
  /*
   * The path parameters provide the operation to do and the collection to use
   * The query string provides the object to insert, find, or update
   */
   console.log("inside mongo route fn");
   console.log("req.params.operation is " + JSON.stringify(req.params.operation));
   console.log("req.params is " + JSON.stringify(req.params));
	switch (req.params.operation) {
		case 'insert':	mongo.insert( 'event', 
		                              req.query,
		                              function(model) {
		                              	console.log("after callback model is " + JSON.stringify(model))
		                                res.render('meeting', {obj: model[0]});
		                                }
		                              );
									 	break;

		case 'find':	mongo.find('event', 
									req.query, 
									function(model){

										return res.render('eventsummary', {obj:model[0]});
									}
								);
					 	break;

		case 'update':	mongo.update( 'event', 
		                              req.query,
		                              function(model) {
		                              		console.log("////going to redirect and event model after update : " + JSON.stringify(model));
		                              		var url="/"+model.id+'/'+model.name+"/12345/6789"
		                              		//res.render('eventsummary',{obj:model})
              								res.redirect(url);
		                                }
		                              );
									 	break;

		// case 'delete': mongo.delete(req.params.collection, 
		// 							req.query, 
		// 							function(model){
		// 								res.render('success', {'title': 'Delete', obj: model});
		// 								});
		// 								break;
	}
}


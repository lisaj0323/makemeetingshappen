var user = require("../models/user.js");
//var events = require("../models/event.js");


exports.getUser = function(req, res){
	console.log("first page req.user is " + JSON.stringify(req.user));
	res.render('layout', { user: req.user });
};

exports.getAccount = function(req, res){
  res.render('account', { user: req.user });
};

exports.doLogin = function(req, res){
  res.render('login', { user: req.user });
 };

exports.addEvents = function(req, res){
	console.log("/////req.user is before add event" + JSON.stringify(req.user) + " and req.params.event_id is " + req.params.event_id);
	user.addEvent(req.user.id, req.params.event_id, req.params.event_name, function(model){
		console.log("//////last model to ejs is " + JSON.stringify(model) + " and model.events is " + JSON.stringify(model.events));
		res.render('layout', {user:model});
	});
	//res.redirect('/'); 
}


// In the case that no route has been matched
exports.errorMessage = function(req, res){
  var message = '<p>Error, did not understand path '+req.path+"</p>";
	// Set the status to 404 not found, and render a message to the user.
  res.status(404).send(message);
};
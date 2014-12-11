var express = require("express"),
	morgan  = require('morgan'),
    path = require('path'), 
    passport = require('passport'), 
    userRoutes = require('./routes/users.js'),
    eventRoutes= require('./routes/events.js'),
    gcal = require('google-calendar'),
    GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;

var User = require("./models/user.js");


var cookieParser = require('cookie-parser'), 
    bodyParser = require('body-parser'),
    session= require('express-session'),
    methodOverride = require('method-override');


var app = express();

function findById(id, fn) {
  console.log("deserialize helper function findById");
  User.findOne("user", {'id': id}, function (err, user) {
    if (err) {
      return fn(err, null);
    } else {
      return fn(null, user);
    }
  });
}

// Passport session setup.
//   To support persistent login sessions, Passport needs to be able to
//   serialize users into and deserialize users out of the session.  Typically,
//   this will be as simple as storing the user ID when serializing, and finding
//   the user by ID when deserializing.  However, since this example does not
//   have a database of user records, the complete Google profile is serialized
//   and deserialized.
passport.serializeUser(function(user, done) {
  //do put 
  console.log("in serialize user is : " + JSON.stringify(user) + " and id is " + user.id);
  done(null, user.id);// primary key 
});

passport.deserializeUser(function(obj, done) { //obj= user.id 
  //find obj 
  findById(obj, function(err, user) {
    done(err, user);
  });
  //done(null, obj);
});


// passport.use(new GoogleStrategy({
//     returnURL: 'http://localhost:50000/auth/google/return',
//     realm: 'http://localhost:50000/'
//   },
//   function(identifier, profile, done) {
//     // asynchronous verification, for effect...
//     process.nextTick(function () {
      
//       // To keep the example simple, the user's Google profile is returned to
//       // represent the logged-in user.  In a typical application, you would want
//       // to associate the Google account with a user record in your database,
//       // and return that user instead.
//       profile.identifier = identifier;
//       return done(null, profile);
//     });
//   }
// ));

passport.use(new GoogleStrategy({
    clientID: '351029077337-lj4ufniaiasdp9gqs36iev730vsuhmsa.apps.googleusercontent.com',
    clientSecret: 'yS45OxLxWD7FcQWMNyM7n1a7',
    callbackURL: "http://setmeetings-lisajung.rhcloud.com/auth/google/return"
  },
  function(token, tokenSecret, profile, done) {
    // asynchronous verification, for effect...
    profile.accessToken = token;

    process.nextTick(function () {
      console.log("in profile stuff");
      // To keep the example simple, the user's Google profile is returned to
      // represent the logged-in user.  In a typical application, you would want
      // to associate the Google account with a user record in your database,
      // and return that user instead.  
    

      //var newUser = { id: profile.id, displayName: profile.displayName, emails: profile.emails[0].value };
      
      User.findOne("user", {id:profile.id}, function(err, user){
        if(err) throw err;
        if(!user){
          console.log("no user lets add");
          var newUser = { id: profile.id, displayName: profile.displayName, emails: profile.emails[0].value, 'events':[] };
          
          User.insert('user', newUser, function(err, user){
           console.log("user insert callback" + JSON.stringify(user));
            return done(null, user);
          })
          //return done(err, newUser);
        }
        else{
          console.log("there is a user in the model : " + JSON.stringify(user));
          return done(null, user);
        }
        //return done(null, user);
      });

      //return done(null, profile);
    });
  }
));

app.set('views', __dirname + '/views');
// Define the view (templating) engine
app.set('view engine', 'ejs');

  app.use(cookieParser());//
  app.use(bodyParser());
  app.use(methodOverride())
  app.use(session({secret:'keyboard cat'}));
  app.use(passport.initialize());
  app.use(passport.session());
  // Set the views directory
  

app.get('/', ensureAuthenticated, userRoutes.getUser);
app.get('/:event_id/:event_name/12345/6789', userRoutes.addEvents);

//app.get('/', )

app.get('/event/:operation', eventRoutes.mongo);
app.post('/event/:operation', eventRoutes.mongo);

//app.get('/event/:operation/:gcal', eventRoutes.importGcal);

app.get('/account', ensureAuthenticated, userRoutes.getAccount);


app.get('/login', userRoutes.doLogin);

// GET /auth/google
//   Use passport.authenticate() as route middleware to authenticate the
//   request.  The first step in Google authentication will involve redirecting
//   the user to google.com.  After authenticating, Google will redirect the
//   user back to this application at /auth/google/return
// app.get('/auth/google', 
//   passport.authenticate('google', { failureRedirect: '/login' }),
//   function(req, res) {
//     res.redirect('/');
//   });

app.get('/auth/google',
  passport.authenticate('google', { scope: ['https://www.googleapis.com/auth/userinfo.profile',
                                            'https://www.googleapis.com/auth/userinfo.email'] }),
  function(req, res){
    // The request will be redirected to Google for authentication, so this
    // function will not be called.
  });


// GET /auth/google/return
//   Use passport.authenticate() as route middleware to authenticate the
//   request.  If authentication fails, the user will be redirected back to the
//   login page.  Otherwise, the primary route function function will be called,
//   which, in this example, will redirect the user to the home page.
app.get('/auth/google/return', 
  passport.authenticate('google', { failureRedirect: '/login' }),
  function(req, res) {
    req.session.access_token = req.user.accessToken;
    res.redirect('/');
});

app.get('/logout', function(req, res){
  req.logout();
  res.redirect('/index.html');
});

// Simple route middleware to ensure user is authenticated.
//   Use this route middleware on any resource that needs to be protected.  If
//   the request is authenticated (typically via a persistent login session),
//   the request will proceed.  Otherwise, the user will be redirected to the
//   login page.
function ensureAuthenticated(req, res, next) {
  if (req.isAuthenticated()) { return next(); }
  res.redirect('/login')
}



app.use(express.static(__dirname + '/public'));

/*
 * OpenShift will provide environment variables indicating the IP 
 * address and PORT to use.  If those variables are not available
 * (e.g. when you are testing the application on your laptop) then
 * use default values of localhost (127.0.0.1) and 33333 (arbitrary).
 */
var ipaddress = process.env.OPENSHIFT_NODEJS_IP || "127.0.0.1";
var port      = process.env.OPENSHIFT_NODEJS_PORT || 50000;

//  Start listening on the specific IP and PORT
app.listen(port, ipaddress, function() {
  console.log('%s: Node server started on %s:%d ...',
               Date(Date.now() ), ipaddress, port);
               });
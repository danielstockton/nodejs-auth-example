
/**
 * Module dependencies.
 */

var express = require('express'),
    mongoose = require('mongoose'),
    User = require('./models/user');
var app = module.exports = express.createServer();

// Configuration

app.configure(function(){
  app.set('views', __dirname + '/views');
  app.set('view engine', 'jade');
  app.use(express.bodyParser());
  app.use(express.cookieParser());
  app.use(express.session({ secret: "parp" }));
  app.use(express.methodOverride());
  app.use(app.router);
  app.use(express.static(__dirname + '/public'));
  app.use(express.logger({ format: '\x1b[1m:method\x1b[0m \x1b[33m:url\x1b[0m :response-time ms' }))
});

app.configure('development', function(){
  app.set('db-uri', 'mongodb://localhost/devdb');
  app.use(express.errorHandler({ dumpExceptions: true, showStack: true })); 
});

app.configure('production', function(){
  app.set('db-uri', 'mongodb://localhost/prodb');
  app.use(express.errorHandler()); 
});

app.configure('test', function() {
  app.set('db-uri', 'mongodb://localhost/testdb');
});

db = mongoose.connect(app.set('db-uri'));

function requiresLogin(req, res, next) {
  if (req.session.user) {
    next();
  } else {
    res.redirect('sessions/new?redir=' + req.url);
  }
};

// Users

app.get('/users/new', function(req, res) {
  res.render('users/new.jade', {
    title: 'Sign Up',
    locals: { user: new User() }
  });
});

app.post('/users', function(req, res) {
  var user = new User(req.body.user);

  function userSaveFailed() {
    req.flash('error', 'Account creation failed');
    res.render('users/new.jade', {
      locals: { user: user }
    });
  }

  user.save(function(err) {
    if (err) return userSaveFailed();

    req.flash('info', 'Your account has been created');
    res.redirect('/');
  });
});

// Sessions

app.get('/sessions/new', function(req, res){
  res.render('sessions/new', {
    title: 'Login',
    redir: req.query.redir
  });
});

app.post('/sessions', function(req, res){
  User.findOne({ email: req.body.username }, function(err, user) {
    if (user && user.authenticate(req.body.password)) {
      req.session.user_id = user.id;
    } else {
      req.flash('error', 'Incorrect credentials');
      res.redirect('/sessions/new');
    }
  }); 
});

app.del('/sessions/new', requiresLogin, function(req, res){
  if (req.session.user) {
    req.session.user.destroy(function() {});
  }
  res.redirect('/sessions/new');
});

// Routes

app.get('/', requiresLogin, function(req, res){
  res.render('index', {
    title: 'Express'
  });
});

// Only listen on $ node app.js

if (!module.parent) {
  app.listen(3000);
  console.log("Express server listening on port %d", app.address().port);
}

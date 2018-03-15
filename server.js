const express = require('express');
const session = require('express-session');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const port = process.env.PORT || 3000;
const app = express();


//Routes
const apiRoutes = require('./routes/apiRoutes.js');
const routes =  require('./routes/index');

// passport
passport.use(new LocalStrategy(
  function(username, password, done) {
    if(username === password) {
      return done(null, {'username': username});
    }
    return done(null, false);
  }
));

passport.serializeUser(function(user, done){
  done(null, user);
});

passport.deserializeUser(function(user, done){
  done(null, user);
})

app.set('view engine', 'ejs');
app.set('views', './views');
app.use(express.static('public'));
app.use('/bower_components', express.static('bower_components'));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json())
app.use(cookieParser());
app.use(session({
  secret: 'abcd1234',
  resave: true,
  saveUninitialized: true
}));
app.use(passport.initialize());
app.use(passport.session());

app.set('permission', {
  after: function(req, res, next, authorizedStatus) {

    if (authorizedStatus !== 'authorized') {

      if(req.originalUrl.startsWith('/api')) {
        res.status(401).end();
      } else {
        res.render('login');
      }
    } else {
      next();
    }
  }
});

app.use('/api', require('permission')(), apiRoutes);
app.use('/', routes);

//App Start


app.listen(port, function(err){
  if(err) throw err;
  console.log(`Listening on ${port}`);
});

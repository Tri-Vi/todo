const express = require('express');
const router = express.Router();
const passport = require('passport');

router.post('/login', passport.authenticate('local', {failureRedirect: '/'}), function(req,res, next){
  req.user.role = [];
  next();
}, function(req, res){
  console.log('post login');
  console.log(req.body);
  res.redirect('/');
});

router.post('/logout', function(req,res){
  delete req.user;
  req.logout();
  res.redirect('/');
});

router.get('/', require('permission')(), function(req, res, next){
  res.render('home');
});

module.exports = router;

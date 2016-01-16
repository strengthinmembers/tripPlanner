var express = require('express'),
    router = express.Router(),
    passport = require('passport');
    User = require('../models/user.js');

router.get('/', function (req, res) {
  console.log('req.body', req.body);
  User.findOne({username: req.body.username}, function (err, doc) {
    console.log('doc', doc);
    if (err) {
      // console.log(err);
      return res.status(500).json({err: err})
    }
    return res.status(200).json(doc)
  })
})

router.post('/register', function(req, res) {
  console.log('hello from /register route', req.body);
  User.register(new User({ username: req.body.username}), req.body.password, function(err, account) {
    if (err) {
      console.log(err);
      return res.status(500).json({err: err})
    }
    passport.authenticate('local')(req, res, function () {
      console.log('what is this?', req.user._id);
      console.log('what type is user id? ', typeof req.user._id)
      return res.status(200).json({status: 'Registration successful!', user_id: req.user._id})
    });
  })
});

router.post('/login', function(req, res, next) {
  passport.authenticate('local', function(err, user, info) {
    console.log('first user variable in login: ', user);
    if (err) { return next(err) }
    if (!user) {
      return res.status(401).json({err: info})
    }
    req.logIn(user, function(err) {
      if (err) {
        return res.status(500).json({err: 'Could not log in user'})
      }
      console.log('what is user on login? ', user);
      console.log('what is type of user._id? ', typeof user._id);
      console.log('just plain user._id: ', user._id);
      res.status(200).json({status: 'Login successful!', user_id: user._id})
    });
  })(req, res, next);
});

router.get('/logout', function(req, res) {
  req.logout();
  res.status(200).json({status: 'Bye!'})
});

module.exports = router;

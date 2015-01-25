var express = require('express');
var passport = require('passport');
var router = express.Router();

router.get('/', function (req, res, next) {
    if (!req.session.passport.user) {
        res.redirect('/login');
    } else {
        res.render('index', { user: req.session.passport.user });
    }
});

router.get('/login', function (req, res, next) {
    res.render('login');
});

router.get('/auth/facebook', passport.authenticate('facebook', { scope: ['email'] }));
router.get('/auth/facebook/callback', passport.authenticate('facebook', { successRedirect: '/', failureRedirect: '/login' }), function(){
    console.log('aqui');
});


module.exports = router;

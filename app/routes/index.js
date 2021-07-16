const express = require('express');
const router = express.Router();
const passport = require('passport');

const User = require('../models/user');
const Room = require('../models/room');

router.get('/', function(req, res, next) {
    if(req.isAuthenticated()) {
        res.redirect('/rooms');
    } else {
        res.render('login', {
            success: req.flash('success')[0],
            errors: req.flash('error'),
            showRegisterForm: req.flash('showRegisterForm')[0]
        });
    }
});

router.post('/login', passport.authenticate('local', {
    successRedirect: '/rooms',
    failureRedirect: '/', 
    failureFlash: true
}));

router.post('/register', function(req, res, next) {
    const credentails = {'username': req.body.username, 'password': req.body.password};

    if(credentials.username === '' || credentials.password === '') {
        req.flash('error', 'Missing credentials');
        req.flash('showRegisterForm', true);
        res.redirect('/');
    } else {
        User.findOne({'username': new RegExp('^' + req.body.username + '$', 'i'), 'socialId': null}, function(err, user) {
            if(err) {
                throw err;
            }
            if(user) {
                req.flash('error', 'Username already exists.');
                req.flash('showRegisterForm', true);
                res.redirect('/');
            } else {
                User.create(credentials, function(err, newUser) {
                    if(err) {
                        throw err;
                    }
                    req.flash('success', 'Your account has been created. Please log in');
                    res.redirect('/');
                });
            }
        });
    }
});

router.get('/auth/facebook')
router.get('/auth/facebook/callback')
router.get('/auth/twitter')
router.get('/auth/twitter/callback')

router.get('/rooms')
router.get('/chat/:id')
router.get('/logout')

module.exports = router;
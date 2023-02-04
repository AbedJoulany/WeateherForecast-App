var express = require('express');
var router = express.Router();
var Cookies = require('cookies');
var showError = false;
const dbModels = require('../models');
// keys to sign cookie values
// to prevent client tampering
var keys = ['keyboard cat']
// static error message variable
var errorMsg = "";

/* GET home page. */
router.get('/', function (req, res, next) {
    res.redirect('/register');
});

/* GET register, renders the Register page with error if there's such */
router.get('/register', function (req, res, next) {
    if (showError) {
        showError = false;
        res.render('index', {title: 'Register page', showError: true, errorMsg: "Email is already registered!"});
    } else
        res.render('index', {title: 'Register page', showError: false, errorMsg: "somthing"});
});


/* POST password for requesting the password page.
setting the cookies for 1 minute and validating the email in the DB*/
router.post('/register/password', function (req, res, next) {

    // ---------- defining cookies when entering password page with max age of 60 seconds -------//
    const cookies = new Cookies(req, res, {keys: keys})
    cookies.set('LastVisit', new Date().toISOString(), {signed: true, maxAge: 60 * 1000});

    console.log(req.body.Email_address)
    //-----------------------------------------------------------------------------//
    dbModels.User.findOne({
        where: {
            email: req.body.Email_address,
        }
    }).then(user => {
        if (user == null)
            throw "email not found"
        showError = true;
        res.redirect('/register');
    }).catch(err => {
        req.session.email = req.body.Email_address;
        req.session.firstName = req.body.First_name;
        req.session.lastName = req.body.Last_name;
        res.render('password', {title: 'password page'});
    });
});

/* get password, redirect to register page*/
router.get('/register/password', function (req, res, next) {
    res.redirect('/register');
});


/* POST login */
router.post('/login', function (req, res, next) {

    const cookies = new Cookies(req, res, {keys: keys})
    const lastVisit = cookies.get('LastVisit', {signed: true});

    // ---------- checking if cookies expired before rendering login page ----------//
    // ----------  if cookies expired redirecting to register page -------------------//
    if (!lastVisit) {
        res.status(404).send('Register failed, you should choose password in 1 min');
    } else {
        // ----------  if cookies not expired redirecting to login page -------------------//
        dbModels.User.create({
            email: req.session.email,
            firstName: req.session.firstName,
            lastName: req.session.lastName,
            password: req.body.password,
        });
        res.status(200).send('email registered successful');
    }

});

/* GET login, renders the login page with error if there's such */
router.get('/login', function (req, res, next) {
    if (showError) {
        showError = false;
        res.render('login', {title: 'Login page', showError: true, errorMsg: errorMsg});
    } else
        res.render('login', {title: 'Login page', showError: false, errorMsg: "somthing"});

});

/* POST weatherForecast, if login valid show the weather page,
otherwise redirict to login with error message*/
router.post('/weatherForecast', function (req, res, next) {

    dbModels.User.findOne({
        where: {
            email: req.body.Email,
        }
    }).then(user => {
        if (user === null)
            throw `email not registered`
        if (user.password === req.body.Password) {
            req.session.email = user.email;
            req.session.userId = user.id;
            req.session.firstName = user.firstName;
            req.session.lastName = user.lastName;
            req.session.loggedIn = true;

            res.render('weatherForecast', {title: 'weather page', userName: (user.firstName + ' ' + user.lastName)});
        } else {
            throw `password isn't correct`;
        }

    }).catch(err => {
        showError = true;
        errorMsg = err;
        res.redirect('/login');
    });
});

/* GET weatherForecast, redirict to login*/
router.get('/weatherForecast', function (req, res, next) {
    if (req.session.loggedIn ===true)
        res.render('weatherForecast', {title: 'weather page', userName: (req.session.firstName + ' ' + req.session.lastName)});
    else
        res.redirect('/login');
});

/* GET readme, render readme.ejs */

router.get('/readme', function (req, res, next) {

    res.render('readme', {title: 'readme'});

});

module.exports = router;

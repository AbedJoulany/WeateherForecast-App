var express = require('express');
var router = express.Router();
const dbModels = require('../models');

/* The API routes */

/* add a new city to the database */
router.post('/weatherForecast/cities', function (req, res, next) {
    dbModels.User.findOne({
        where: {
            email: req.session.email,
        }
    }).then(user => {
        dbModels.City.create({
            id_user: user.id,
            name: req.body.name,
            longitude: req.body.longitude,
            latitude: req.body.latitude,
        });
    }).catch(err => {
        req.session = null; //removes the session ID cookie
        res.redirect('/login');
    });
});


/* get the cities JSON (all the cities for the current user)*/
router.get('/weatherForecast/cities', function (req, res, next) {

    dbModels.City.findAll({
        where: {
            id_user: req.session.userId,
        }
    }).then(cities => {
        res.send(cities);

    }).catch(err => {
        let data = {name:"default",longitude:"0.0",latitude:'0.0'};
        req.session = null; //removes the session ID cookie
        res.redirect('/login');

    });

});

/* remove a city from the database */
router.delete('/weatherForecast/cities/:city/:longitude/:latitude', function (req, res, next) {

    dbModels.City.findOne({
        where: {
            id_user: req.session.userId,
            name: req.params.city,
            longitude: req.params.longitude,
            latitude: req.params.latitude,
        }
    }).then(user => {
        user.destroy();

    }).catch(err => {
        req.session = null; //removes the session ID cookie
        res.redirect('/login');
    });
});

/* remove all cities from the cities list */
router.delete('/weatherForecast/cities', function (req, res, next) {

    dbModels.City.findAll({
        where: {
            id_user: req.session.userId,
        }
    }).then(cities => {
        for(i of cities)
            i.destroy();
    }).catch(err => {
        req.session = null; //removes the session ID cookie
        res.redirect('/login');
    });
});

module.exports = router;


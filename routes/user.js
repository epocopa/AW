var express = require('express');
var router = express.Router();
var path = require('path');


/* GET users listing. */
router.get('/', function(req, res, next) {
	res.send('respond with a resource');
});

router.get('/login', function (req, res) {
	res.render("login");
});

router.post('/login', function (req, res) {
	res.send(req.body);
});

router.get('/register', function (req, res) {
	res.render("register");
});

router.post('/register', function (req, res) {
	res.send(req.body);
});






module.exports = router;

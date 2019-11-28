const config = require("../config");
const DAOUsers = require("../DAOUsers");
const express = require("express");
const mysql = require("mysql");

const router = express.Router();

const pool = mysql.createPool(config.mysqlConfig);
const daoUsers = new DAOUsers(pool);

/* GET users listing. */
router.get('/', function(req, res, next) {
    res.send('respond with a resource');
});

router.get('/login', function(req, res) {
    res.status(200);
    res.render("login", { title: "login" });
});

router.post("/login", function(req, res) {
    daoUsers.identificarUsuario(req.body.email, req.body.password, function(err, ok) {
        if (err) {
            res.status(500);
            res.render("login", { title: "login", errorMsg: "Error interno de acceso a la BD" });
        } else if (ok) {
            //req.session.currentUser = req.body.email;
            res.render("profile");
        } else {
            res.status(200);
            res.render("login", { title: "login", errorMsg: "Email y/o contraseña no válidos" });
        }
    });
});

router.get('/register', function(req, res) {
    res.render("register", { title: "register" });
});

router.post('/register', function(req, res) {
    res.send(req.body);
});

module.exports = { router, pool };
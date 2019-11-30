const config = require("../config");
const DAOUsers = require("../DAOUsers");
const express = require("express");
const mysql = require("mysql");
const createError = require('http-errors');

const router = express.Router();

const pool = mysql.createPool(config.mysqlConfig);
const daoUsers = new DAOUsers(pool);

router.get('/', function(req, res, next) {
    //TODO
    //si esta conectado ir a home, si no ir a perfil
});

router.get('/login', function(req, res) {
    res.status(200);
    res.render("login", { title: "login" });
});

router.post("/login", function (req, res, next) {
    daoUsers.identificarUsuario(req.body.email, req.body.password, function(err, ok) {
        if (err) {
            res.status(401);
            res.render("login", { title: "login", errorMsg: "Error interno de acceso a la BD" });
        } else if (ok) {
            req.session.currentUser = req.body.email;
			/* TODO: hacer render junto con los datos del usuario registrado */
			daoUsers.mostrarPerfil(req.session.currentUser, function(err, result){
				if(err){
                    next(createError(500));
				}else{
					res.render("profile",{
						email: result[0].email ,
						password: result[0].password,
						fullname: result[0].fullname,
						sex: result[0].sex,
						birthdate: result[0].birthdate,
						profile_image: result[0].profile_image,
						points: result[0].points});
				}
			});
        } else {
            res.status(200);
            res.render("login", { title: "login", errorMsg: "Email y/o contraseña no válidos" });
        }
    });
});

router.get("/register", function(req, res) {
    res.status(200);
    res.render("register", { title: "register", head: "Nuevo Usuario", action:"register"  });
});

router.post("/register", function(req, res, next) {
    let user = {
        email: req.body.email ,
        password: req.body.password,
        fullname: req.body.fullname,
        sex: req.body.sex,
        birthdate: req.body.birthdate,
        profile_image: req.body.profile_image,
        points: 0
    }


    daoUsers.crearUsuario(user, function(err){
        if(err){
            next(createError(500));
        }else{
            res.render("profile",{
                email: req.body.email ,
                password: req.body.password,
                fullname: req.body.fullname,
                sex: req.body.sex,
                birthdate: req.body.birthdate,
                photo: req.body.photo,
                points: 0}
            );
        }
    });
});

router.get("/modify", function(req, res) {
    res.status(200);
    res.render("register", { title: "modify", head: "Modificar Usuario", action: "modify" });
});

router.post("/modify", function(req, res, next) {
    let user = {
        email: req.body.email ,
        password: req.body.password,
        fullname: req.body.fullname,
        sex: req.body.sex,
        birthdate: req.body.birthdate,
        profile_image: req.body.profile_image,
        points: 0
    }

    daoUsers.modificarUsuario(user, function(err){
        if(err){
            next(createError(500));
        }else{
            res.render("profile",{
                email: req.body.email ,
                password: req.body.password,
                fullname: req.body.fullname,
                sex: req.body.sex,
                birthdate: req.body.birthdate,
                photo: req.body.photo,
                points: 0}
            );
        }
    });
});


router.get("/profile", function (req, res) {
    res.status(200);
    res.render("profile", { });
});


module.exports = { router, pool };
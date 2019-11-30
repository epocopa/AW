const config = require("../config");
const DAOUsers = require("../DAOUsers");
const express = require("express");
const mysql = require("mysql");
const createError = require('http-errors');

const router = express.Router();

const pool = mysql.createPool(config.mysqlConfig);
const daoUsers = new DAOUsers(pool);


const redirectLogin = function(req, res, next) {
	if (!req.session.currentUser) {
		res.redirect("login");
	} else {
		next();
	}
}

const redirectProfile = function (req, res, next) {
	if (req.session.currentUser) {
		res.redirect("profile");
	} else {
		next();
	}
}



router.get('/', function (req, res, next) {
	res.redirect("/user/login");
});

router.get('/login', redirectProfile, function (req, res) {
	res.status(200);
	res.render("login", { title: "login" });
});

router.post("/login", redirectProfile,  function (req, res, next) {
	daoUsers.identificarUsuario(req.body.email, req.body.password, function (err, ok) {
		if (err) {
			next(createError(500));
		} else if (ok) {
			daoUsers.mostrarPerfil(req.body.email, function (err, result) {
				if (err) {
					next(createError(500));
				} else {
					req.session.currentUser = JSON.parse(JSON.stringify(result[0]));
					res.redirect("/user/profile")
				}
			});
		} else {
			res.status(401);
			res.render("login", { title: "login", errorMsg: "Email y/o contraseña no válidos" });
		}
	});
});

router.get("/register", redirectProfile,  function (req, res) {
	res.status(200);
	res.render("register", { title: "register" });
});

router.post("/register", redirectProfile,  function (req, res, next) {
	let user = {
		email: req.body.email,
		password: req.body.password,
		fullname: req.body.fullname,
		sex: req.body.sex,
		birthdate: req.body.birthdate,
		profile_image: req.body.profile_image,
		points: 0
	}

	daoUsers.crearUsuario(user, function (err) {
		if (err) {
			next(createError(500));
		} else {
			res.redirect("/user/login");
		}
	});
});

router.get("/modify", redirectLogin, function (req, res) {
	res.status(200);
	res.render("modify", { title: "modify", user: req.session.currentUser });
});

router.post("/modify", redirectLogin, function (req, res, next) {

	req.session.currentUser.email =  req.body.email || req.session.currentUser.email;
	req.session.currentUser.pass = req.body.password || req.session.currentUser.pass;
	req.session.currentUser.fullname = req.body.fullname || req.session.currentUser.fullname;
	req.session.currentUser.sex = req.body.sex || req.session.currentUser.sex;
	req.session.currentUser.birthdate = req.body.birthdate || req.session.currentUser.birthdate;
	req.session.currentUser.profile_image = req.body.profile_image || req.session.currentUser.profile_image;


	
	
	daoUsers.modificarUsuario(req.session.currentUser, function (err) {
		if (err) {
			next(createError(500));
		} else {
			res.redirect("profile");
		}
	});
});

router.get("/profile", redirectLogin, function (req, res) {
	res.status(200);
	var diff = Date.now() - new Date(req.session.currentUser.birthdate);
	var age_temp = new Date(diff);
	var age = Math.abs(age_temp.getUTCFullYear() - 1970);

	res.render("profile", { user: req.session.currentUser, age }
	);
});
//TODO hay que darle 2 veces??
router.get("/logout", redirectLogin, function (req, res) {
	req.session.destroy(function(err) {
		if (err) {
			log(err);
			res.redirect("profile")
		}

		res.clearCookie("connect.sid");
	})
});

module.exports = { router, pool };
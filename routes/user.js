const config = require("../config");
const DAOUsers = require("../dao/DAOUsers");

const express = require("express");
const mysql = require("mysql");
const createError = require('http-errors');
const bcrypt = require('bcryptjs');
const path = require("path");
const multer = require("multer");
const router = express.Router();

const pool = mysql.createPool(config.mysqlConfig);
const daoUsers = new DAOUsers(pool);

const multerFactory = multer({ dest: path.join(__dirname, "../uploads")});

const redirectLogin = function(req, res, next) {
    if (!req.session.currentUser) {
        res.redirect("/user/login");
    } else {
        next();
    }
}

const redirectProfile = function(req, res, next) {
    if (req.session.currentUser) {
        res.redirect("/user/profile");
    } else {
        next();
    }
}

//-------------------------------------------------------------------------------------

router.get('/', function(req, res, next) {
    res.redirect("/user/login");
});

router.get('/login', redirectProfile, function(req, res) {
    let estilos = "<link rel='stylesheet' href='/stylesheets/login.css'>";

    res.status(200);
    res.render("login", { title: "login", styles: estilos });
});

router.post("/login", redirectProfile, function(req, res, next) {
    let estilos = "<link rel='stylesheet' href='/stylesheets/login.css'>";

    daoUsers.identificarUsuario(req.body.email, req.body.password, function(err, ok) {
        if (err) {
            next(createError(500));
        } else if (ok) {
            daoUsers.mostrarPerfil(req.body.email, function(err, result) {
                if (err) {
                    next(createError(500));
                } else {
                    req.session.currentUser = JSON.parse(JSON.stringify(result[0]));
                    res.redirect("/user/profile")
                }
            });
        } else {
            res.status(401);
            res.render("login", { title: "login", errorMsg: "Email y/o contraseña no válidos", styles: estilos });
        }
    });
});

router.get("/register", redirectProfile, function(req, res) {
    let estilos = '<link rel="stylesheet" href="/stylesheets/register.css">';

    res.status(200);
    res.render("register", { title: "register", styles: estilos, errores: 0 });
});

router.post("/register", multerFactory.single("photo"), redirectProfile, function (req, res, next) {
	let estilos = '<link rel="stylesheet" href="/stylesheets/register.css">';
	let nombreFichero = null;

	if (req.file) {
		console.log(`Nombre del fichero: ${req.file.filename}`);
		nombreFichero = req.file.filename;
	}
	
	req.checkBody("password", "La contraseña no es válida").isLength({ min: 4, max: 10 });
	req.checkBody("email", "Dirección de correo no válida").isEmail();
	req.checkBody("fullname","Nombre de usuario no válido").matches(/^[A-Z0-9]+$/i);

	req.getValidationResult().then(function(result) {
		if (result.isEmpty()) {
			bcrypt.hash(req.body.password, 6, function(err, hash) {
				let user = {
					email: req.body.email,
					password: hash,
					fullname: req.body.fullname,
					sex: req.body.sex,
					birthdate: req.body.birthdate,
					image: nombreFichero,
					points: 0
				}
		
				daoUsers.crearUsuario(user, function(err) {
					if (err) {
						console.log(err.code);
						if (err.code == 'ER_DUP_ENTRY') {
							res.status(418);
							res.render("register", { title: "register", errorMsg: "El email ya existe en la base de datos",  errores: result.array(), styles: estilos });
						} else {
							next(createError(500));
						}
					} else {
						res.redirect("/user/login");
					}
				});
			});
		} else {
			res.render("register", { title: "register", errores: result.array() , styles: estilos });
		}
	});
});

router.get("/uploads/:id", function (req, res) {
    let pathImg = path.join(__dirname, "../uploads", req.params.id);
    res.status(200);

    res.sendFile(pathImg);
});

router.get("/modify", redirectLogin, function(req, res) {
    let estilos = '<link rel="stylesheet" href="/stylesheets/register.css">';

    res.status(200);
    res.render("modify", { title: "modify", user: req.session.currentUser, styles: estilos, errores: 0 });
});

router.post("/modify", multerFactory.single("photo"), redirectLogin, function(req, res, next) {
    let estilos = '<link rel="stylesheet" href="/stylesheets/register.css">';
    let nombreFichero = null;

	if (req.file) {
		console.log(`Nombre del fichero: ${req.file.filename}`);
		nombreFichero = req.file.filename;
    }
	
	req.checkBody("password", "La contraseña no es válida").isLength({ min: 4, max: 10 });
	req.checkBody("email", "Dirección de correo no válida").isEmail();
	req.checkBody("fullname","Nombre de usuario no válido").matches(/^[A-Z0-9]+$/i);

	req.getValidationResult().then(function(result) {
		if (result.isEmpty()) {
			bcrypt.compare(req.body.password, req.session.currentUser.pass, function(err, result) {
				if(err){
					next(createError(500));
				}else{
					if (!result) {
						res.status(401);
						res.render("modify", { title: "login", user: req.session.currentUser, errorMsg: "Email y/o contraseña no válidos", styles: estilos });
					} else {
						req.session.currentUser.email = req.body.email || req.session.currentUser.email;
						req.session.currentUser.fullname = req.body.fullname || req.session.currentUser.fullname;
						req.session.currentUser.sex = req.body.sex || req.session.currentUser.sex;
						req.session.currentUser.birthdate = req.body.birthdate || req.session.currentUser.birthdate;
						req.session.currentUser.image = nombreFichero || req.session.currentUser.image;
			
						console.log(nombreFichero);
						
						daoUsers.modificarUsuario(req.session.currentUser, function(err) {
							if (err) {
								next(createError(500));
							} else {
								res.redirect("profile");
							}
						});
					}
				}
			});
		} else {
			res.render("modify", { title: "modify", user: req.session.currentUser, errores: result.array(), styles: estilos });
		}
	});
});

router.get("/profile", redirectLogin, function(req, res) {
    let estilos = '<link rel="stylesheet" href="/stylesheets/profile.css">';
    
    res.status(200);
    var diff = Date.now() - new Date(req.session.currentUser.birthdate);
    var age_temp = new Date(diff);
	var age = Math.abs(age_temp.getUTCFullYear() - 1970);
	
	daoUsers.leerImagenes(req.session.currentUser.id_user, function(err, result) {
		res.render("profile", {
			title: "profile",
			user: req.session.currentUser,
			age,
			styles: estilos,
			allowed: true,
			images: result
		});
	});
});

router.get("/profile/:id", redirectLogin, function (req, res) {
    let estilos = '<link rel="stylesheet" href="/stylesheets/profile.css">';

    res.status(200);
    daoUsers.mostrarPerfilPorId(req.params.id, function (err, result) {
        if (err) {
            next(createError(500));
        } else {
            let user = JSON.parse(JSON.stringify(result[0]));
            var diff = Date.now() - new Date(user.birthdate);
            var age_temp = new Date(diff);
            var age = Math.abs(age_temp.getUTCFullYear() - 1970);

			daoUsers.leerImagenes(req.session.currentUser.id_user, function(err, result) {
				res.render("profile", {
					title: "profile",
					user,
					age,
					styles: estilos,
					allowed: false,
					images: result
				});
			});
        }
    });
});

router.get("/logout", redirectLogin, function(req, res) {
    req.session.destroy(function(err) {
        if (err) {
            res.redirect("profile");
        }
        res.clearCookie("connect.sid");
        res.redirect("/user/login");
    })
});

router.get("/friends", redirectLogin, function(req, res, next) {
    let estilos = '<link rel="stylesheet" href="/stylesheets/friends.css">';

    res.status(200);

    daoUsers.listarSolicitudes(req.session.currentUser.id_user, function(err, result_solicitudes) {
        if (err) {
            next(createError(500));
        } else {
            daoUsers.listarAmigos(req.session.currentUser.id_user, function(err, result_amigos) {
                if (err) {
                    next(createError(500));
                } else {
                    res.render("friends", { title: "friends", user: req.session.currentUser, requests: result_solicitudes, friends: result_amigos, styles: estilos });
                }
            });
        }
    });
});

router.get("/friends/accept/:id", redirectLogin, function (req, res, next) {
    daoUsers.aceptarSolicitud(req.session.currentUser.id_user, req.params.id, function (err) {
        if (err) {
            console.log(err);        
            next(createError(500));
        } else {            
            res.redirect("/user/friends");
        }
    });
});

router.get("/friends/reject/:id", redirectLogin, function (req, res, next) {
    daoUsers.rechazarSolicitud(req.session.currentUser.id_user, req.params.id, function (err) {
        if (err) {
            next(createError(500));
        } else {
            res.redirect("/user/friends");
        }
    });
});


router.get('/search', redirectLogin, function(req, res, next) {
    let estilos = '<link rel="stylesheet" href="/stylesheets/search_users.css">';

    daoUsers.buscarUsuarios(req.session.currentUser.id_user, req.query.text_search, function(err, result) {
        if (err) {
            next(createError(500));
        } else {
            res.render("search_users", { title: "search_users", users: result, user: req.session.currentUser, styles: estilos, search: req.query.text_search });
        }
    });
});

router.post('/request_friend', redirectLogin, function(req, res, next) {

    daoUsers.solicitarAmistad(req.session.currentUser.id_user, req.body.ident, function(err) {
        if (err) {
            next(createError(500));
        } else {
            res.redirect("search?text_search=" + req.body.query_string);
        }
    });
});

router.post("/profile/image", multerFactory.single("image"), redirectLogin, function (req, res, next) {
	let nombreFichero = null;

    if(req.session.currentUser.points >= 100){
        if (req.file) {
            console.log(`Nombre del fichero: ${req.file.filename}`);
            nombreFichero = req.file.filename;
        }
        
        req.checkBody("description", "La descripcion tiene un maximo de 140 caracteres").isLength({ min: 0, max: 140 });
        
        daoUsers.insertarImagen(req.session.currentUser, nombreFichero, req.body.description, function(err) {
            if (err) {
                next(createError(500));
            } else {
                req.session.currentUser.points -= 100;
                res.redirect("/user/profile");
            }	
        });
    }else{
        res.redirect("/user/profile");
    }
});

module.exports = { router, pool, redirectLogin };



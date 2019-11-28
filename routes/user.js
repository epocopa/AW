const config = require("../config");
const DAOUsers = require("../DAOUsers");

const mysqlSession = require("express-mysql-session");
const cookieParser = require("cookie-parser");
const session = require("express-session");
const express = require("express");
const mysql = require("mysql");
const user = express();

const MySQLStore = mysqlSession(session);
const router = express.Router();

//pool de conexiones a la base de datos de MySQL
const pool = mysql.createPool(config.mysqlConfig);

//instancia de DAOUsers
const daoUsers = new DAOUsers(pool);

//permite almacenar la informacion de sesion en la BD
const sessionStore = new MySQLStore(pool);

//middleware que contiene los datos de sesion correspondientes al cliente actual
const middlewareSession = session({
	saveUninitialized: false,//indica que no se cree ninguna sesión para los clientes que no estén en la BD de sesiones
	secret: "", //cadena que se utiliza para firmar el SID que se envía al cliente.
	resave: false, //fuerza a que se guarde, o no, el contenido en la sesión en la BD
	store: sessionStore 
});

user.use(cookieParser());
user.use(middlewareSession);

/* GET users listing. */
router.get('/', function(req, res, next) {
	res.send('respond with a resource');
});

router.get('/login', function (req, res) {
	res.status(200);
	res.render("login");
});

router.post("/login", function (req, res) {
	daoUsers.identificarUsuario(req.body.email, req.body.password, function(err, ok){
		if(err){
			res.status(500);
			res.render("login", {errorMsg: "Error interno de acceso a la BD"});
		}else if(ok){
			//req.session.currentUser = req.body.email;
			res.render("profile");
		}else{
			res.status(200);
			res.render("login", {errorMsg: "Email y/o contraseña no válidos"});
		}
	});
});

router.get('/register', function (req, res) {
	res.render("register");
});

router.post('/register', function (req, res) {
	res.send(req.body);
});






module.exports = router;

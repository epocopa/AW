const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const session = require("express-session");
const mysqlSession = require("express-mysql-session");

const indexRouter = require('./routes/index');
const userRouter = require('./routes/user');
const questionRouter = require('./routes/question');
const expressValidator = require("express-validator");

const app = express();
const MySQLStore = mysqlSession(session);

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(expressValidator());

const sessionStore = new MySQLStore({
	host: "localhost",
	user: "root",
	password: "",
	database: "aw"
});
//middleware que contiene los datos de sesion correspondientes al cliente actual
const middlewareSession = session({
	saveUninitialized: false, //indica que no se cree ninguna sesión para los clientes que no estén en la BD de sesiones
	secret: "Xenial Xerus", //cadena que se utiliza para firmar el SID que se envía al cliente.
	resave: false, //fuerza a que se guarde, o no, el contenido en la sesión en la BD
	store: sessionStore
});

app.use(middlewareSession);
app.use('/', indexRouter);
app.use('/user', userRouter.router);
app.use('/question', questionRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
	next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
	// set locals, only providing error in development
	res.locals.message = err.message;
	res.locals.error = req.app.get('env') === 'development' ? err : {};

	// render the error page
	res.status(err.status || 500);
	res.render('error');
});

module.exports = app;
const express = require('express');
const router = express.Router();
const createError = require('http-errors');
const DAOQuestions = require("../dao/DAOQuestions");
const DAOUsers = require("../dao/DAOUsers");
const userRouter = require('./user');

const daoQuestions = new DAOQuestions(userRouter.pool);
const daoUsers = new DAOUsers(userRouter.pool);

//-------------------------------------------------------------------------------------

router.get('/questions', userRouter.redirectLogin, function(req, res, next) {
    let estilos = '<link rel="stylesheet" href="/stylesheets/questions.css">';

    daoQuestions.generarAleatorias(function(err, result){
        if(err){
            next(createError(500));
        }else{
            res.status(200);
            res.render("questions", { title: "questions", styles: estilos, user: req.session.currentUser, quests: result });
        }
    });
});

router.get('/question/:id', userRouter.redirectLogin, function (req, res, next) {
	let estilos = '<link rel="stylesheet" href="/stylesheets/question.css">';

	daoQuestions.leerPregunta(req.params.id, function (err, result1) {
		if (err) {
			next(createError(500));
		} else {
			daoQuestions.comprobarContestada(req.session.currentUser.id_user, req.params.id, function (err, result2) {
				if (err) {
					next(createError(500));
				} else {
					daoQuestions.listarAmigosPreguntaContestada(req.session.currentUser.id_user, req.params.id, function (err, result3) {
						if (err) {
							console.log(err);
							next(createError(500));
						} else {										
							res.status(200);
							res.render("question", { title: "question", styles: estilos, user: req.session.currentUser, question: result1, answered: result2, friendsAnswer: result3 });
						}
					});
				}
			});
		}
	});
});


router.get('/create_question', userRouter.redirectLogin, function(req, res) {
    let estilos = '<link rel="stylesheet" href="/stylesheets/create_question.css">';

    res.status(200);
    res.render("create_question", { title: "create_question", styles: estilos, user: req.session.currentUser });
});

router.post('/add_question', userRouter.redirectLogin, function(req, res, next) {
    let question = {
        title: req.body.title_question,
        opA: req.body.option1,
        opB: req.body.option2,
        opC: req.body.option3,
        opD: req.body.option4
    }

    daoQuestions.crearPregunta(question, function(err) {
        if (err) {
            next(createError(500));
        } else {
            res.redirect("questions");
        }
    });
});

router.get('/answer/:id', userRouter.redirectLogin, function(req, res, next) {
    let estilos = '<link rel="stylesheet" href="/stylesheets/answer.css">';

	daoQuestions.leerPregunta(req.params.id, function(err, result){
		if(err){
            next(createError(500));
		}else{			
			res.status(200);
			res.render("answer", { title: "answer", styles: estilos, user: req.session.currentUser, question: result });
		}
	});
});

router.post('/answer/:id', userRouter.redirectLogin, function(req, res, next) {
	let answer = {
		question: req.params.id,
		user: req.session.currentUser.id_user,
		answer: req.body.ans,
		other: req.body.other
	}

	daoQuestions.contestarPregunta(answer, function(err){
		if(err){
            next(createError(500));
		}else{			
		    res.status(200);
   	 		res.redirect("/question/question/" + req.params.id);
		}
	});
});

router.get('/guess/:question/:user', userRouter.redirectLogin, function(req, res, next){
	let estilos = '<link rel="stylesheet" href="/stylesheets/answer.css">';

	daoQuestions.leerPregunta(req.params.question, function (err, result1) {
		if (err) {
			next(createError(500));
		} else {
			daoUsers.mostrarPerfilPorId(req.params.user, function(err, result2){
				if (err){
					next(createError(500));
				} else {
					daoQuestions.leerRespuestas(req.params.question, req.params.user, function(err, result3){
						if(err){
							next(createError(500));
						}else{
							res.status(200);

							let answers = [];

							if(result3.other != ''){
								answers.push(result1.opA);
								answers.push(result1.opB);
								answers.push(result1.opC);
								answers.push(result3.other);

								/*
								let j, x;
								
								for(let i = 3; i > 0; i--){
									j = Math.floor(Math.random()* (i+1));
									x = answers[i];
									answers[i] = answers[j];
									answers[j] = x;									
								}*/

								result1.opD = answers.pop();
								result1.opC = answers.pop();
								result1.opB = answers.pop();
								result1.opA = answers.pop();
							}

							res.render("answerOther", { title: "answerOther", styles: estilos, user: req.session.currentUser, question: result1, friend: result2[0] });
						}
					});
				}
			});
		}
	});
});

router.post('/guess/:question/:user', userRouter.redirectLogin, function (req, res, next) {
	
	let answer = {
		question: req.params.question,
		user: req.params.user,
		userGuess: req.session.currentUser.id_user,
		answer: req.body.ans
	}

	daoQuestions.responderPorOtro(answer, function (err, result) {
		if (err) {
			next(createError(500));
		} else {
			if(result){
				req.session.currentUser.points += 50;
			}

			res.status(200);
			res.redirect("/question/question/" + req.params.question);
		}
	});

});


module.exports = router;

const express = require('express');
const router = express.Router();
const createError = require('http-errors');
const DAOQuestions = require("../DAOQuestions");
const userRouter = require('./user');
const daoQuestions = new DAOQuestions(userRouter.pool);

router.get('/questions', userRouter.redirectLogin, function(req, res) {
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

router.get('/question/:id', userRouter.redirectLogin,  function(req, res) {
    let estilos = '<link rel="stylesheet" href="/stylesheets/question.css">';

	daoQuestions.leerPregunta(req.params.id, function(err, result1){
		if(err){
			nex(createError(500));
		}else if(result1){
			daoQuestions.comprobarContestada(req.session.currentUser.id_user, req.params.id, function(err, result2){		
				if(err){
					next(createError(500));
				}else{			
					res.status(200);
					res.render("question", { title: "question", styles: estilos, user: req.session.currentUser, question: result1, answered: result2 });
				}
			});
		}else{
			res.status(401);
		}
	});
});

router.get('/create_question', userRouter.redirectLogin, function(req, res) {
    let estilos = '<link rel="stylesheet" href="/stylesheets/create_question.css">';

    res.status(200);
    res.render("create_question", { title: "create_question", styles: estilos, user: req.session.currentUser });
});

router.post('/add_question', userRouter.redirectLogin, function(req, res) {
    let question = {
        title: req.body.title_question,
        opA: req.body.option1,
        opB: req.body.option2,
        opC: req.body.option3,
        opD: req.body.optionD
    }

    daoQuestions.crearPregunta(question, function(err) {
        if (err) {
            next(createError(500));
        } else {
            res.redirect("questions");
        }
    });
});

router.get('/answer/:id', userRouter.redirectLogin, function(req, res) {
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

router.post('/answer/:id', userRouter.redirectLogin, function(req, res) {
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

module.exports = router;

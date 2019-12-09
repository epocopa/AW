const { promisify } = require('util');

class DAOQuestions {
    constructor(pool) {
        this.pool = pool;
    }

    crearPregunta(question, callback){
        this.pool.getConnection(function(err, connection) {
            if(err){
                callback(err);
            }else{
                const sql = "INSERT INTO question (title, opA, opB, opC, opD) VALUES (?, ?, ?, ?, ?)";
                connection.query(sql, [
                    question.title,
                    question.opA,
                    question.opB,
                    question.opC,
                    question.opD
                ],
                function(err, result){
					connection.release();
                    if(err){
                        callback(err);
                    }else{
                        callback(null, result);
                    }
                });
            }
        });
    }

	leerPregunta(id, callback){
		this.pool.getConnection(function(err, connection){
            if(err){
                callback(err);
            }else{
                const sql = "SELECT * FROM question WHERE id_question = ?";
                connection.query(sql, [id], function(err, result){
					connection.release();
                    if(err){
                        callback(err);
                    }else{
                        callback(null, result[0]);
                    }
                });
            }
		});
	}

    generarAleatorias(callback){
        this.pool.getConnection(function(err, connection){
            if(err){
                callback(err);
            }else{
                const sql = "SELECT * FROM question ORDER BY RAND() LIMIT 4";
                connection.query(sql, function(err, result){
					connection.release();
                    if(err){
                        callback(err);
                    }else{
                        callback(null, result);
                    }
                });
            }
        });
	}
	
	contestarPregunta(answer, callback){
		this.pool.getConnection(function(err, connection){
			if(err){
				callback(err);
			}else{
				const sql = "INSERT INTO answer (question, user, answer, other) VALUES (?, ?, ?, ?)";
				connection.query(sql, [
					answer.question, 
					answer.user, 
					answer.answer, 
					answer.other
				], function(err){
					connection.release();
					if(err){
						callback(err);
					}else{
						callback(null);
					}
				});
			}
		});
	}

	comprobarContestada(id_user, id_question, callback){
		this.pool.getConnection(function(err, connection){
			if(err){
				callback(err, null);
			}else{
				const sql = "SELECT count(*) AS quest FROM answer WHERE user = ? AND question = ? ";
				connection.query(sql, [id_user, id_question], function(err, result){
					connection.release();
					if(err){
						callback(err, null);
					}else{									
						if(result[0].quest > 0){
							callback(null, result);
						}else{
							callback(null, false);
						}						
					}
				});
			}
		});
    }

    comprobarContestadaPorOtro(id_user, id_question, callback) {
        this.pool.getConnection(function (err, connection) {
            if (err) {
                callback(err, null);
            } else {
                const sql = "SELECT correct FROM answerForOther WHERE user = ? AND question = ? ";
                connection.query(sql, [id_user, id_question], function (err, result) {
                    connection.release();
                    if (err) {
                        callback(err, null);
                    } else {
                        if (!result[0]) {
                            callback(null, false, null);
                        } else {
                            callback(null, true, result[0].correct);
                        }
                    }
                });
            }
        });
    }
    
    listarAmigosPreguntaContestada(id_user, id_question, callback) {
        this.pool.getConnection(function (err, connection) {
            if (err) {
                callback(err, null);
            } else {
                const sql = "SELECT fullname, image, id_user FROM answer a JOIN user u ON u.id_user = a.user WHERE question = ? AND a.user IN(SELECT userb FROM friend WHERE usera = ?)";
                connection.query(sql, [id_question, id_user], function (err, result) {
                    if (err) {
                        callback(err, null);
                    } else {
                        // TODOOO
                        result.forEach(e => { 
                            const sql = "SELECT correct FROM answerForOther WHERE user = ? AND question = ? ";
                            const promiseQuery = promisify(pool.query).bind(pool);
                            const result = await promiseQuery(sql, [id_user, id_question]);
                            if (result2[0]) {
                                e.correct = result2[0].correct;
                                e.answeredOther = true;
                            }
                        });
                        callback(null, result);
                    }
                });
            }
        });
    }

    responderPorOtro(answer, callback) {
        this.pool.getConnection(function (err, connection) {
            if (err) {
                callback(err);
            } else {
                const sql = "SELECT answer FROM answer WHERE user = ? AND question = ?";
                connection.query(sql, [answer.user, answer.question], function (err, result) {
                    if (err) {
                        callback(err);
                    } else {
                        answer.correct = (result[0].answer == answer.answer);
                        const sql2 = "INSERT INTO answerForOther (question, user, userGuess, answer, correct) VALUES (?, ?, ?, ?, ?)";
                        connection.query(sql2, [
                            answer.question,
                            answer.user,
                            answer.userGuess,
                            answer.answer,
                            answer.correct
                        ], function (err) {
                            connection.release();
                            if (err) {
                                callback(err);
                            } else {
                                callback(null);
                            }
                        });
                    }
                });
            }
        });
    }
}

module.exports = DAOQuestions;
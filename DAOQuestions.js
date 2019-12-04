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
}

module.exports = DAOQuestions;
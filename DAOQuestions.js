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
                    if(err){
                        callback(err);
                    }else{
                        callback(null, result);
                    }
                });
            }
        });
    }

    
}

module.exports = DAOQuestions;
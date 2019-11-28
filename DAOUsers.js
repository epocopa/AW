const mysql = require("mysql");

class DAOUsers {
	constructor(pool) {
		this.pool = pool;
    }

	//Identificación en la red social
	identificarUsuario(email, pw, callback){
		this.pool.getConnection(function(err, connection){
			if(err){
				callback(err);
			}else{
				const sql = "SELECT COUNT(*) FROM user WHERE email = ? AND pw = ?";
				connection.query(sql, [email, pw], function(err, result){
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

	//Creación de usuarios
	crearUsuario(user ,callback){
		this.pool.getConnection(function(err, connection){
			if(err){
				callback(err);
			}else{
				const sql = "INSERT INTO user VALUES (?, ?, ?, ?, ?, ?, ?)";
				connection.query(sql, [
					user.email, 
					user.pass, 
					user.fullname, 
					user.sex, 
					user.birthdate, 
					user.image, 
					user.points
				], 
					function(err, result){
						if(err){
							callback(err);
						}else{
							callback(null);
						}
					});
			}
		});
	}

	//Página de perfil de usuario
	mostrarPerfil(email, callback) {
		this.pool.getConnection(function (err, connection) {
			if (err) {
				callback(err);
			} else {
				const sql = "SELECT * FROM user WHERE email = ?";
				connection.query(sql, [email], function (err, result) {
					connection.release();
					if (err) {
						callback(err);
					} else {
						let user = {
							id: result.id,
							email: result.email,
							fullname: result.fullname,
							sex: result.sex,
							birthdate: result.birthdate,
							image: result.image,
							points: result.points
						};

						callback(null, user);
					}
				});
			}
		});
	}

	//Modificación de perfil
	modificarUsuario(user, callback){
		this.pool.getConnection(function(err, connection){
			if(err){
				callback(err);
			}else{
				const sql = "UPDATE user SET email = ? pass= ? fullname= ? sex = ? birthdate = ? image = ? points = ?";
				connection.query(sql, [
					user.email, 
					user.pass, 
					user.fullname, 
					user.sex, 
					user.birthdate, 
					user.image, 
					user.points
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

	//Vista de amigos
	listarSolicitudes(id, callback){
		//SELECT U.fullname  FROM user U, request R WHERE U.id_user = R.fromUser AND R.toUser = 5;
		//SELECT fullname FROM user JOIN request WHERE id_user = fromUser AND toUser = 5; 
		this.pool.getConnection(function(err, connection){
			if(err){
				callback(err);
			}else{
				const sql = "SELECT fullname FROM user JOIN request WHERE id_user = fromUser AND toUser = ?";
				connection.query(sql, [id], function(err, result){
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

	buscarUsuario(searchUser, callback){
		this.pool.getConnection(function(err, connection){
			if(err){
				callback(err);
			}else{
				const sql = "SELECT fullname FROM user WHERE fullname = ?";
				connection.query(sql, [searchUser], function(err, result){
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

	listarAmigos(id, callback){
		this.pool.getConnection(function(err, connection){
			if(err){
				callback(err);
			}else{
				const sql = " "; //TODO
				connection.query(sql, [id], function(err, result){
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
}

module.exports = DAOUsers;
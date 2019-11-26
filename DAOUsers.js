const mysql = require("mysql");

class DAOUsers {
	constructor(pool) {
		this.pool = pool;
    }

	//muestra los datos de perfil del usuario registrado
	mostrarPerfil(email, callback){
		this.pool.getConnection(function(err, connection){
			if(err){
				callback(err);
			}else{
				const sql = "SELECT * FROM user WHERE email = ?";
				connection.query(sql, [email], function(err, result){
					connection.release();
					if(err){
						callback(err);
					}else{
						let user = {
							id: result.id,
							email: result.email,
							fullname: result.fullname,
							sex: result.sex,
							birthdate: result.birthdate,
							image : result.image,
							points: result.points
						};

						callback(null, user);
					}
				});
			}
		});
	}

	//identificacion del usuario cuando se logea
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

	//crear nuevo usuario
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

	//modificar datos de usuario existente
	modificarUsuario(){

	}
}



module.exports = DAOUsers;
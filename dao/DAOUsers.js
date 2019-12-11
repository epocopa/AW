const bcrypt = require('bcryptjs');

class DAOUsers {
	constructor(pool) {
		this.pool = pool;
	}

	//Identificación en la red social
	identificarUsuario(email, pw, callback) {
		this.pool.getConnection(function(err, connection) {
			if (err) {
				callback(err, null);
			} else {
				const sql = "SELECT pass FROM user WHERE email = ?";
				connection.query(sql, [email], function(err, result) {
					connection.release();
					if (err) {
						callback(err, null);
					} else {
						if (!result[0]) {
							callback(null, false);
						} else {
							bcrypt.compare(pw, result[0].pass, function(err, res) {
								callback(null, res);
							});
						}
					}
				});
			}
		});
	}

	//Creación de usuarios
	crearUsuario(user, callback) {
		this.pool.getConnection(function(err, connection) {
			if (err) {
				callback(err);
			} else {
				const sql = "INSERT INTO user (email, pass, fullname, sex, birthdate, image, points) VALUES (?, ?, ?, ?, ?, ?, ?)";
				connection.query(sql, [
						user.email,
						user.password,
						user.fullname,
						user.sex,
						user.birthdate,
						user.image,
						user.points
					],
					function(err, result) {
						if (err) {
							callback(err);
						} else {
							callback(null, result);
						}
					});
			}
		});
	}

	//Página de perfil de usuario
	mostrarPerfil(email, callback) {
		this.pool.getConnection(function(err, connection) {
			if (err) {
				callback(err);
			} else {
				const sql = "SELECT * FROM user WHERE email = ?";
				connection.query(sql, [email], function(err, result) {
					connection.release();
					if (err) {
						callback(err);
					} else {
						result[0].birthdate = result[0].birthdate.toLocaleDateString();
						callback(null, result);
					}
				});
			}
		});
	}

	//Página de perfil de usuario
	mostrarPerfilPorId(id, callback) {
		this.pool.getConnection(function (err, connection) {
			if (err) {
				callback(err);
			} else {
				const sql = "SELECT * FROM user WHERE id_user = ?";
				connection.query(sql, [id], function (err, result) {
					connection.release();
					if (err) {
						callback(err);
					} else {
						result[0].birthdate = result[0].birthdate.toLocaleDateString();
						callback(null, result);
					}
				});
			}
		});
	}

	//Modificación de perfil
	modificarUsuario(user, callback) {
		this.pool.getConnection(function(err, connection) {
			if (err) {
				callback(err);
			} else {
				const sql = "UPDATE user SET email = ?, pass= ?, fullname= ?, sex = ?, birthdate = ?, image = ? WHERE id_user = ?";
				connection.query(sql, [
						user.email,
						user.pass,
						user.fullname,
						user.sex,
						user.birthdate,
						user.image,
						user.id_user
					],
					function(err, result) {
						connection.release();
						if (err) {
							callback(err);
						} else {
							callback(null, result);
						}
					});
			}
		});
	}

	//Vista de amigos
	listarSolicitudes(id, callback) {
		this.pool.getConnection(function(err, connection) {
			if (err) {
				callback(err);
			} else {
				const sql = "SELECT fullname, fromUser, image FROM user JOIN request ON id_user = fromUser AND toUser = ?";
				connection.query(sql, [id], function(err, result) {
					connection.release();
					if (err) {
						callback(err);
					} else {
						callback(null, result);
					}
				});
			}
		});
	}

	buscarUsuarios(id_user, searchUser, callback) {
		this.pool.getConnection(function(err, connection) {
			if (err) {
				callback(err);
			} else {
				const sql1 = "SELECT id_user, fullname, image FROM user WHERE fullname LIKE ?";
				connection.query(sql1, ['%' + searchUser + '%'], function(err, result_sql1) {
					if (err) {
						callback(err);
					} else {
						const sql2 = "SELECT userb FROM friend WHERE usera = ?";
						connection.query(sql2, [id_user], function(err, result_sql2) {
							if (err) {
								callback(err);
							} else {
								const sql3 = "SELECT toUser FROM request WHERE fromUser = ?";
								connection.query(sql3, [id_user], function (err, result_sql3) {
									connection.release();
									if (err) {
										callback(err);
									} else {
										let result = [];
										let pendientes = [];
										
										result_sql3.forEach(e => {
											pendientes.push(e.toUser);
										});
										
										result_sql1 = result_sql1.filter(e => (e.id_user != id_user));

										result_sql1.forEach(element_sql1 => {
											let user;
											let esAmigo = false;
											let peticion = false;
											let entra = false;
											result_sql2.forEach(element_sql2 => {
												if (!entra) {
													if (element_sql1.id_user == element_sql2.userb) {
														esAmigo = true;
														entra = true;
													}			
												}
											});
											
											if (pendientes.includes(element_sql1.id_user)) {
												peticion = true;
											}
											user = {
												id: element_sql1.id_user,
												fullname: element_sql1.fullname,
												esAmigo,
												peticion,
												image: element_sql1.image
											}											
											result.push(user);
										});
										callback(null, result);
									}
								});
							}
						});
					}
				});
			}
		});
	}

	listarAmigos(id, callback) {
		this.pool.getConnection(function(err, connection) {
			if (err) {
				callback(err);
			} else {
				const sql = "SELECT fullname, id_user, image FROM friend JOIN user on (userb = id_user)WHERE usera = ?";
				connection.query(sql, [id], function(err, result) {
					connection.release();
					if (err) {
						callback(err);
					} else {
						callback(null, result);
					}
				});
			}
		});
	}

	solicitarAmistad(id_user, id_request, callback) {
		this.pool.getConnection(function(err, connection) {
			if (err) {
				callback(err);
			} else {
				const sql = "INSERT INTO request (fromUser, toUser) VALUES (?, ?)";
				connection.query(sql, [id_user, id_request], function(err, result) {
					connection.release();
					if (err) {
						callback(err);
					} else {
						callback(null, result);
					}
				});
			}
		});
	}
	
	aceptarSolicitud(usera, userb, callback) {
		this.pool.getConnection(function (err, connection) {
			if (err) {
				callback(err);
			} else {
				const sql = "INSERT INTO friend (usera, userb) VALUES (?, ?), (?, ?)";
				connection.query(sql, [usera, userb, userb, usera], function (err, result) {
					if (err) {
						callback(err);
					} else {
						const sql2 = "DELETE FROM request WHERE (fromUser = ? AND toUser = ?) OR (toUser = ? AND fromUser = ?)";
						connection.query(sql2, [userb, usera, userb, usera], function (err, result2) {
							connection.release();
							if (err) {
								callback(err);
							} else {
								callback(null, result2);
							}
						});
					}
				});
			}
		});
	}

	rechazarSolicitud(usera, userb, callback) {
		this.pool.getConnection(function (err, connection) {
			if (err) {
				callback(err);
			} else {
				const sql = "DELETE FROM request WHERE (fromUser = ? AND toUser = ?) OR (toUser = ? AND fromUser = ?)";
				connection.query(sql, [userb, usera, userb, usera], function (err, result) {
					connection.release();
					if (err) {
						callback(err);
					} else {
						callback(null, result);
					}
				});
			}
		});
	}

	leerImagenes(user, callback)  {
		this.pool.getConnection(function(err, connection) {
			if (err) {
				callback(err);
			} else {
				const sql = "SELECT image, description FROM images WHERE user = ?";
				connection.query(sql, [user], function(err, result) {
					connection.release();
					if (err) {
						callback(err);
					} else {
						callback(null, result);
					}
				});
			}
		});
	}

	insertarImagen(user, imagen, desc, callback)  {
		this.pool.getConnection(function(err, connection) {
			if (err) {
				callback(err);
			} else {
				const sql = "INSERT INTO images VALUES(?, ?, ?)";
				connection.query(sql, [user.id_user, imagen, desc], function(err, result) {
					if (err) {
						callback(err);
					} else {
						const sql2 = "UPDATE user SET points = points - 100 WHERE id_user = ?";
						connection.query(sql2, [user.id_user], function(err){
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
		});
	}
}


module.exports = DAOUsers;
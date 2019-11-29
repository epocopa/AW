const mysql = require("mysql");

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
                const sql = "SELECT COUNT(*) AS count FROM user WHERE email = ? AND pass = ?";
                connection.query(sql, [email, pw], function(err, result) {
                    connection.release();
                    if (err) {
                        callback(err, null);
                    } else {
                        let ok = false;
                        if (result[0].count != 0) {
                            ok = true;
                        }
                        callback(null, ok);
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
                console.log("AQUI");
            } else {
                const sql = "INSERT INTO user (email, pass, fullname, sex, birthdate, image, points) VALUES (?, ?, ?, ?, ?, ?, ?)";
                connection.query(sql, [
                        user.email,
                        user.pass,
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
                const sql = "SELECT fullname FROM user JOIN request WHERE id_user = fromUser AND toUser = ?";
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

    buscarUsuario(searchUser, callback) {
        this.pool.getConnection(function(err, connection) {
            if (err) {
                callback(err);
            } else {
                const sql = "SELECT fullname FROM user WHERE fullname = ?";
                connection.query(sql, [searchUser], function(err, result) {
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

    listarAmigos(id, callback) {
        this.pool.getConnection(function(err, connection) {
            if (err) {
                callback(err);
            } else {
                const sql = " "; //TODO
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
}

module.exports = DAOUsers;
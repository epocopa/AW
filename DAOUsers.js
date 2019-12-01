const mysql = require("mysql");
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
                        bcrypt.compare(pw, result[0].pass, function (err, res) {
                            callback(null, res);
                        });
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

    buscarUsuarios(searchUser, callback) {
        this.pool.getConnection(function(err, connection) {
            if (err) {
                callback(err);
            } else {
                const sql = "SELECT fullname FROM user WHERE fullname LIKE ?";
                connection.query(sql, ['%' + searchUser + '%'], function(err, result) {
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
                const sql = "SELECT userb FROM friend WHERE usera = ?";
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
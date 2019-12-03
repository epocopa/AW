CREATE OR REPLACE TABLE user(
	id_user INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
	email VARCHAR(50) UNIQUE,
	pass VARCHAR(60),
	fullname VARCHAR(40),
	sex CHAR(1),
	birthdate DATE,
	image VARCHAR(20),
	points INT DEFAULT 0
);

CREATE OR REPLACE TABLE question(
	id_question INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
	title VARCHAR(100),
	opA VARCHAR(50),
	opB VARCHAR(50),
	opC VARCHAR(50),
	opD VARCHAR(50)
);

CREATE OR REPLACE TABLE answer(
	question INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
	user INT NOT NULL,
	answer ENUM('a', 'b', 'c', 'd', 'o'),
	other VARCHAR(50),
	FOREIGN KEY (user) REFERENCES user(id_user),
	FOREIGN KEY (question) REFERENCES question(id_question)
);

CREATE OR REPLACE TABLE answerForOther(
	question INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
	user INT NOT NULL,
	userGuess INT NOT NULL,
	answer ENUM('a', 'b', 'c', 'd'),
	correct BOOLEAN NOT NULL DEFAULT 0,
	FOREIGN KEY (user) REFERENCES user(id_user),	
	FOREIGN KEY (userGuess) REFERENCES user(id_user),	
	FOREIGN KEY (question) REFERENCES question(id_question)
);

CREATE OR REPLACE TABLE friend(
	usera INT NOT NULL,
	userb INT NOT NULL,
	FOREIGN KEY (usera) REFERENCES user(id_user),
	FOREIGN KEY (userb) REFERENCES user(id_user),
	PRIMARY KEY(usera, userb)
);

CREATE OR REPLACE TABLE request(
	fromUser INT NOT NULL,
	toUser INT NOT NULL,
	FOREIGN KEY (fromUser) REFERENCES user(id_user),
	FOREIGN KEY (toUser) REFERENCES user(id_user),
	PRIMARY KEY(fromUser, toUser)
);

INSERT INTO `user` (`id_user`, `email`, `pass`, `fullname`, `sex`, `birthdate`, `image`, `points`) VALUES ('1', 'usuario1@ucm.es', '$2a$06$Ry0SCsmOzt4r4p8oHyLiO.OZYUJtSvGgR0H9MAqVoEeJM8Grzvn1m', 'Usuario1', 'M', '2019-11-26', NULL, '32');
INSERT INTO `user` (`id_user`, `email`, `pass`, `fullname`, `sex`, `birthdate`, `image`, `points`) VALUES ('2', 'usuario2@ucm.es', '$2a$06$Ry0SCsmOzt4r4p8oHyLiO.OZYUJtSvGgR0H9MAqVoEeJM8Grzvn1m', 'Usuario2', 'M', '2019-11-21', NULL, '30');
INSERT INTO `user` (`id_user`, `email`, `pass`, `fullname`, `sex`, `birthdate`, `image`, `points`) VALUES ('3', 'usuario3@ucm.es', '$2a$06$Ry0SCsmOzt4r4p8oHyLiO.OZYUJtSvGgR0H9MAqVoEeJM8Grzvn1m', 'Usuario3', 'H', '2019-10-21', NULL, '12');
INSERT INTO `user` (`id_user`, `email`, `pass`, `fullname`, `sex`, `birthdate`, `image`, `points`) VALUES ('4', 'usuario4@ucm.es', '$2a$06$Ry0SCsmOzt4r4p8oHyLiO.OZYUJtSvGgR0H9MAqVoEeJM8Grzvn1m', 'Usuario4', 'H', '2019-10-11', NULL, '36');
INSERT INTO `user` (`id_user`, `email`, `pass`, `fullname`, `sex`, `birthdate`, `image`, `points`) VALUES ('5', 'usuario5@ucm.es', '$2a$06$Ry0SCsmOzt4r4p8oHyLiO.OZYUJtSvGgR0H9MAqVoEeJM8Grzvn1m', 'Usuario5', 'H', '2018-10-11', NULL, '76');
INSERT INTO `user` (`id_user`, `email`, `pass`, `fullname`, `sex`, `birthdate`, `image`, `points`) VALUES ('6', 'usuario6@ucm.es', '$2a$06$Ry0SCsmOzt4r4p8oHyLiO.OZYUJtSvGgR0H9MAqVoEeJM8Grzvn1m', 'Usuario6', 'M', '2018-12-01', NULL, '46');
INSERT INTO `user` (`id_user`, `email`, `pass`, `fullname`, `sex`, `birthdate`, `image`, `points`) VALUES ('7', 'usuario7@ucm.es', '$2a$06$Ry0SCsmOzt4r4p8oHyLiO.OZYUJtSvGgR0H9MAqVoEeJM8Grzvn1m', 'Usuario7', 'H', '2018-06-12', NULL, '57');

INSERT INTO `friend` (`usera`, `userb`) VALUES ('1', '2');
INSERT INTO `friend` (`usera`, `userb`) VALUES ('1', '3');
INSERT INTO `friend` (`usera`, `userb`) VALUES ('1', '4');
INSERT INTO `friend` (`usera`, `userb`) VALUES ('2', '1');
INSERT INTO `friend` (`usera`, `userb`) VALUES ('2', '3');
INSERT INTO `friend` (`usera`, `userb`) VALUES ('2', '4');
INSERT INTO `friend` (`usera`, `userb`) VALUES ('3', '1');
INSERT INTO `friend` (`usera`, `userb`) VALUES ('3', '2');
INSERT INTO `friend` (`usera`, `userb`) VALUES ('4', '1');
INSERT INTO `friend` (`usera`, `userb`) VALUES ('4', '2');

INSERT INTO `request` (`fromUser`, `toUser`) VALUES ('4', '3');
INSERT INTO `request` (`fromUser`, `toUser`) VALUES ('5', '3');
INSERT INTO `request` (`fromUser`, `toUser`) VALUES ('6', '3');
INSERT INTO `request` (`fromUser`, `toUser`) VALUES ('1', '6');
INSERT INTO `request` (`fromUser`, `toUser`) VALUES ('2', '6');
INSERT INTO `request` (`fromUser`, `toUser`) VALUES ('3', '6');
INSERT INTO `request` (`fromUser`, `toUser`) VALUES ('4', '6');
INSERT INTO `request` (`fromUser`, `toUser`) VALUES ('1', '5');
INSERT INTO `request` (`fromUser`, `toUser`) VALUES ('2', '5');
INSERT INTO `request` (`fromUser`, `toUser`) VALUES ('7', '1');

INSERT INTO `question` (`id_question`, `title`, `opA`, `opB`, `opC`, `opD`) VALUES ('1', '¿Esto es una pregunta?', 'Si', 'No', 'Tal vez', 'Quizás');
INSERT INTO `question` (`id_question`, `title`, `opA`, `opB`, `opC`, `opD`) VALUES ('2', '¿Quién fue el ganador del Oscar al mejor actor en 2016?', 'Leonardo DiCaprio', 'Nicolas Cage', 'Brad Pitt', 'Antonio Banderas');
INSERT INTO `question` (`id_question`, `title`, `opA`, `opB`, `opC`, `opD`) VALUES ('3', '¿Cuál es la capital de Chile?', 'Santiago de Chile', 'Madrid', 'Otawa', 'Cali');
INSERT INTO `question` (`id_question`, `title`, `opA`, `opB`, `opC`, `opD`) VALUES ('4', '¿Cuál es la primera potencia mundial actualmente?', 'China', 'Rusia', 'EEUU', 'Madagascar');
INSERT INTO `question` (`id_question`, `title`, `opA`, `opB`, `opC`, `opD`) VALUES ('5', '¿Quién es el hombre con más dinero del mundo?', 'Steve Jobs', 'Jeff Bezos', 'Ines Arrimadas', 'Valle Inclán');
INSERT INTO `question` (`id_question`, `title`, `opA`, `opB`, `opC`, `opD`) VALUES ('6', '¿Cuál es el país más grande del mundo?', 'Rusia', 'Mongolia', 'India', 'Jamaica');
INSERT INTO `question` (`id_question`, `title`, `opA`, `opB`, `opC`, `opD`) VALUES ('7', '¿Cuántos viajes hizo Cristóbal Colón a las Indias?', 'Tres', 'Dos', 'Cuatro', 'Diez');
INSERT INTO `question` (`id_question`, `title`, `opA`, `opB`, `opC`, `opD`) VALUES ('8', '¿Cuántas veces parpadea una persona por semana?', '25k veces', '10k veces', '4k veces', '13k veces');

INSERT INTO `answer` (`question`, `user`, `answer`, `other`) VALUES ('1', '1', 'a', NULL);
INSERT INTO `answer` (`question`, `user`, `answer`, `other`) VALUES ('2', '2', 'b', NULL);
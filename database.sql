CREATE OR REPLACE TABLE user(
	id_user INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
	email VARCHAR(50),
	pass VARCHAR(50),
	fullname VARCHAR(40),
	sex CHAR(1),
	birthdate DATE,
	image VARCHAR(20),
	points INT DEFAULT 0
);

CREATE OR REPLACE TABLE question(
	id_question INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
	title VARCHAR(50),
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

INSERT INTO `user` (`id_user`, `email`, `pass`, `fullname`, `sex`, `birthdate`, `image`, `points`) VALUES ('1', 'usuario1@ucm.es', '1234', 'Usuario1', 'M', '2019-11-26', NULL, '32');
INSERT INTO `user` (`id_user`, `email`, `pass`, `fullname`, `sex`, `birthdate`, `image`, `points`) VALUES ('2', 'usuario2@ucm.es', '1234', 'Usuario2', 'M', '2019-11-21', NULL, '30');
INSERT INTO `user` (`id_user`, `email`, `pass`, `fullname`, `sex`, `birthdate`, `image`, `points`) VALUES ('3', 'usuario3@ucm.es', '1234', 'Usuario3', 'H', '2019-10-21', NULL, '12');
INSERT INTO `user` (`id_user`, `email`, `pass`, `fullname`, `sex`, `birthdate`, `image`, `points`) VALUES ('4', 'usuario4@ucm.es', '1234', 'Usuario4', 'H', '2019-10-11', NULL, '36');

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
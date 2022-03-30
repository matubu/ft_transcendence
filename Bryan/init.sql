CREATE TABLE IF NOT EXISTS public."MFA"
(
	id 		numeric UNIQUE NOT NULL,
	secret	character varying[] NOT NULL,
	uri		character varying[] NOT NULL,
	qr		character varying[] NOT NULL,
	PRIMARY KEY (id)
);

CREATE TABLE IF NOT EXISTS public."Picture"
(
	id 			numeric UNIQUE NOT NULL,
	name	 	character varying[] UNIQUE NOT NULL,
	url		 	character varying[] UNIQUE NOT NULL,
	PRIMARY KEY (id)
);

CREATE TABLE IF NOT EXISTS public."User"
(
	id 			numeric UNIQUE NOT NULL,
	fullname 	character varying[] NOT NULL,
	nickname 	character varying[] UNIQUE,
	twoauth		boolean NOT NULL,
	elo			numeric NOT NULL,
	id_MFA		numeric,
	id_picture	numeric,
	PRIMARY KEY (id),
	FOREIGN KEY(id_MFA) REFERENCES "MFA"(id),
	FOREIGN KEY(id_picture) REFERENCES "Picture"(id)
);

CREATE TABLE IF NOT EXISTS public."Friend"
(
	id 			numeric UNIQUE NOT NULL,
	id_user 	numeric UNIQUE NOT NULL,
	id_friend	numeric UNIQUE NOT NULL,
	PRIMARY KEY (id),
	FOREIGN KEY(id_users, id_friend) REFERENCES "User"(id)
);

CREATE TABLE IF NOT EXISTS public."Channel"
(
	id			numeric UNIQUE NOT NULL,
	id_admin	numeric UNIQUE NOT NULL,
	name 		character varying[],
	password 	character varying[],
	description	character varying[],
	private 	boolean,
	PRIMARY KEY (id),
	FOREIGN KEY(id_admin) REFERENCES "User"(id)
);

CREATE TABLE IF NOT EXISTS public."Access"
(
	id			numeric UNIQUE NOT NULL,
	id_user 	numeric NOT NULL,
	id_channel 	numeric NOT NULL,
	PRIMARY KEY (id),
	FOREIGN KEY(id_user) REFERENCES "User"(id),
	FOREIGN KEY(id_channel) REFERENCES "Channel"(id)
);

CREATE TABLE IF NOT EXISTS public."Message"
(
	id			numeric UNIQUE NOT NULL,
	id_user 	numeric NOT NULL,
	id_channel 	numeric NOT NULL,
	msg 		character varying[] NOT NULL,
	PRIMARY KEY (id),
	FOREIGN KEY(id_user) REFERENCES "User"(id),
	FOREIGN KEY(id_channel) REFERENCES "Channel"(id)
);

CREATE TABLE IF NOT EXISTS public."Match"
(
	id 				numeric UNIQUE NOT NULL,
	player1 		numeric NOT NULL,
	player2 		numeric NOT NULL,
	player1_score	numeric NOT NULL,
	player2_score	numeric NOT NULL,
	victory			numeric,
	PRIMARY KEY (id),
	FOREIGN KEY(player1, player2, victory) REFERENCES "User"(id)
);

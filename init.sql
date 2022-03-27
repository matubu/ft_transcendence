CREATE TABLE public."Users"
(
	id 			numeric UNIQUE NOT NULL,
	fullname 	character varying[] NOT NULL,
	nickname 	character varying[],
	twoauth		boolean NOT NULL,
	code2FA		character varying[],
	img			character varying[] NOT NULL,
	elo			numeric NOT NULL,
	friends		numeric[],
	PRIMARY KEY (id)
);

CREATE TABLE public."Matchs"
(
	id 				numeric UNIQUE NOT NULL,
	player1 		numeric NOT NULL,
	player2 		numeric NOT NULL,
	player1_score	numeric NOT NULL,
	player2_score	numeric NOT NULL,
	victory			numeric,
	PRIMARY KEY (id)
);

CREATE TABLE public."Channels"
(
	id			numeric UNIQUE NOT NULL,
	users 		numeric[] NOT NULL,
	name 		character varying[],
	password 	character varying[],
	grade 		character varying[],
	PRIMARY KEY (id)
);

CREATE TABLE public."Messages"
(
	id			numeric UNIQUE NOT NULL,
	id_user 	numeric NOT NULL,
	id_channel 	numeric NOT NULL,
	msg 		character varying[] NOT NULL,
	PRIMARY KEY (id)
);

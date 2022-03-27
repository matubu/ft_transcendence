CREATE TABLE public."Users"
(
	id 			numeric,
	id42 		numeric,
	fullname 	character varying[],
	nickname 	character varying[],
	twoauth		boolean,
	code2FA		character varying[],
	img			character varying[],
	elo			numeric,
	PRIMARY KEY (id)
);

CREATE TABLE public."Matchs"
(
	id 				numeric,
	player1 		numeric,
	player2 		numeric,
	player1_score	numeric,
	player2_score	numeric,
	victory			numeric,
	PRIMARY KEY (id)
);

CREATE TABLE public."Channels"
(
	id			numeric,
	idChannel	numeric,
	users 		numeric[],
	name 		character varying[],
	password 	character varying[],
	grade 		character varying[],
	PRIMARY KEY (id)
);

CREATE TABLE public."Messages"
(
	id			numeric,
	id_user 	numeric,
	id_channel 	numeric,
	msg 		character varying[],
	PRIMARY KEY (id)
);

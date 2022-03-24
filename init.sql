CREATE TABLE public."Testos"
(
    id 		numeric,
    name	character varying[],
    ok 		boolean,
    PRIMARY KEY (id)
);

CREATE TABLE public."Users"
(
	id 			numeric,
	fullname 	character varying[],
	pseudo 		character varying[],
	twoauth		boolean,
	img			character varying[]
);

CREATE TABLE public."Matchs"
(
	id 		numeric,
	player1 numeric,
	player2 numeric,
	victory numeric,
	PRIMARY KEY (id)
);

CREATE TABLE public."Channels"
(
	id 			numeric,
	users 		numeric[],
	name 		character varying[],
	password 	character varying[],
	grade 		character varying[],
	PRIMARY KEY (id)
);

CREATE TABLE public."Messages"
(
	id_user 	numeric,
	id_channel 	numeric,
	msg 		character varying[]
);

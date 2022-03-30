CREATE TABLE IF NOT EXISTS public.double2factor
(
	id 		numeric UNIQUE NOT NULL,
	secret	character varying[] NOT NULL,
	uri		character varying[] NOT NULL,
	qr		character varying[] NOT NULL,
	PRIMARY KEY (id)
);

CREATE TABLE IF NOT EXISTS public.user
(
	id 			numeric UNIQUE NOT NULL,
	fullname 	character varying[] NOT NULL,
	nickname 	character varying[] UNIQUE,
	twoauth		boolean NOT NULL,
	id_2FA		numeric,
	img			character varying[] NOT NULL,
	elo			numeric NOT NULL
	PRIMARY KEY (id),
	FOREIGN KEY(id_2FA) REFERENCES double2factor(id)
);

CREATE TABLE IF NOT EXISTS public.friend
(
	id 			numeric UNIQUE NOT NULL,
	id_users 	numeric UNIQUE NOT NULL,
	id_friend	numeric UNIQUE NOT NULL,
	PRIMARY KEY (id),
	FOREIGN KEY(id_users, id_friend) REFERENCES user(id)
);

CREATE TABLE IF NOT EXISTS public.channel
(
	id			numeric UNIQUE NOT NULL,
	id_admin	numeric UNIQUE NOT NULL,
	name 		character varying[],
	password 	character varying[],
	description	character varying[],
	private 	boolean,
	PRIMARY KEY (id),
	FOREIGN KEY(id_admin) REFERENCES user(id)
);

CREATE TABLE IF NOT EXISTS public.access
(
	id			numeric UNIQUE NOT NULL,
	id_user 	numeric NOT NULL,
	id_channel 	numeric NOT NULL,
	PRIMARY KEY (id),
	FOREIGN KEY(id_user) REFERENCES user(id),
	FOREIGN KEY(id_channel) REFERENCES channel(id)
);

CREATE TABLE IF NOT EXISTS public.message
(
	id			numeric UNIQUE NOT NULL,
	id_user 	numeric NOT NULL,
	id_channel 	numeric NOT NULL,
	msg 		character varying[] NOT NULL,
	PRIMARY KEY (id),
	FOREIGN KEY(id_user) REFERENCES user(id),
	FOREIGN KEY(id_channel) REFERENCES channel(id)
);

CREATE TABLE IF NOT EXISTS public.match
(
	id 				numeric UNIQUE NOT NULL,
	player1 		numeric NOT NULL,
	player2 		numeric NOT NULL,
	player1_score	numeric NOT NULL,
	player2_score	numeric NOT NULL,
	victory			numeric,
	PRIMARY KEY (id),
	FOREIGN KEY(player1, player2, victory) REFERENCES user(id)
);

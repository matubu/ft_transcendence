CREATE TABLE IF NOT EXISTS public.achievement
(
	id INT UNIQUE NOT NULL,
    title TEXT UNIQUE NOT NULL,
    description	TEXT UNIQUE NOT NULL,
    private BOOLEAN DEFAULT FALSE NOT NULL,
	PRIMARY KEY (id)
);

INSERT INTO "public"."achievement" ("id","title","description","private")
VALUES ('1', 'Security', 'Enable two-factor authentication.', FALSE);

INSERT INTO "public"."achievement" ("id","title","description","private")
VALUES ('2', 'Losing', 'Have 42 defeats.', FALSE);

INSERT INTO "public"."achievement" ("id","title","description","private")
VALUES ('3', 'Win', 'Have 42 victoire.', FALSE);

INSERT INTO "public"."achievement" ("id","title","description","private")
VALUES ('4', 'Small player', 'Play a game', FALSE);

INSERT INTO "public"."achievement" ("id","title","description","private")
VALUES ('5', 'I am the boss', 'Create a channel', FALSE);

INSERT INTO "public"."achievement" ("id","title","description","private")
VALUES ('6', 'I would ban you all', 'Become a channel admin', FALSE);

INSERT INTO "public"."achievement" ("id","title","description","private")
VALUES ('7', 'YourName.', 'Change his nickname', FALSE);

INSERT INTO "public"."achievement" ("id","title","description","private")
VALUES ('8', 'Mona Lisa', 'Change your photo', FALSE);

INSERT INTO "public"."achievement" ("id","title","description","private")
VALUES ('9', 'Alcoholic', 'Change your nickname to an alcohol name', TRUE);

INSERT INTO "public"."achievement" ("id","title","description","private")
VALUES ('10', 'Usurper', 'Change your nickname by intra 42 of one of the creators', TRUE);

INSERT INTO "public"."achievement" ("id","title","description","private")
VALUES ('11', 'Under the table', 'Take Fanny', FALSE);

INSERT INTO "public"."achievement" ("id","title","description","private")
VALUES ('12', 'Fanny', 'Put Fanny', FALSE);

INSERT INTO "public"."achievement" ("id","title","description","private")
VALUES ('13', 'The end', 'Achieve all the achievement', TRUE);

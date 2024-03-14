-- ANSWER:
SELECT u.id as user_id, u.username, u.email, a.id as artist_id, a.tagline, t.name as trackname, t.isrc as track_isrc
FROM users u 
JOIN artists a ON u.id = a.user_id
LEFT JOIN tracks t ON a.id = t.artist_id;

-- FOR TESTING:

use music;
CREATE TABLE users (
	id serial PRIMARY KEY,
	username VARCHAR(50) UNIQUE NOT NULL,
	email VARCHAR(255) NOT NULL,
	created_at DATE NOT NULL
);

CREATE TABLE artists (
	id serial PRIMARY KEY,
    user_id INT,
	artist_name VARCHAR(100),
	tagline VARCHAR(255) NOT NULL,
	FOREIGN KEY (user_id) REFERENCES users (id)
);

CREATE TABLE tracks (
	id serial PRIMARY KEY,
	artist_id INT NOT NULL,
	name VARCHAR(255) NOT NULL,
	isrc VARCHAR(12),
	FOREIGN KEY (artist_id) REFERENCES artists (id)
);

INSERT INTO users (username, email, created_at) VALUES ('user1', 'email1@gmail.com', '2022-12-12');
INSERT INTO users (username, email, created_at) VALUES ('user2', 'email2@gmail.com', '2022-12-12');
INSERT INTO users (username, email, created_at) VALUES ('user3', 'email3@gmail.com', '2022-12-12');
INSERT INTO users (username, email, created_at) VALUES ('user4', 'email4@gmail.com', '2022-12-12');
INSERT INTO users (username, email, created_at) VALUES ('user5', 'email5@gmail.com', '2022-12-12');
INSERT INTO users (username, email, created_at) VALUES ('user6', 'email6@gmail.com', '2022-12-12');
INSERT INTO users (username, email, created_at) VALUES ('user7', 'email7@gmail.com', '2022-12-12');
INSERT INTO users (username, email, created_at) VALUES ('user8', 'email8@gmail.com', '2022-12-12');




INSERT INTO artists (user_id, artist_name, tagline) VALUES (1, 'artist1', 'tagline1');
INSERT INTO artists (user_id, artist_name, tagline) VALUES (2, 'artist2', 'tagline2');
INSERT INTO artists (user_id, artist_name, tagline) VALUES (3, 'artist3', 'tagline3');
INSERT INTO artists (user_id, artist_name, tagline) VALUES (5, 'artist5', 'tagline5');
INSERT INTO artists (user_id, artist_name, tagline) VALUES (6, 'artist6', 'tagline6');
INSERT INTO artists (user_id, artist_name, tagline) VALUES (8, 'artist7', 'tagline7');





INSERT INTO tracks (artist_id, name, isrc) VALUES (1, 'track1', 'isrc1');
INSERT INTO tracks (artist_id, name, isrc) VALUES (1, 'track2', 'isrc2');
INSERT INTO tracks (artist_id, name, isrc) VALUES (2, 'track3', 'isrc3');
INSERT INTO tracks (artist_id, name, isrc) VALUES (3, 'track4', 'isrc4');
INSERT INTO tracks (artist_id, name, isrc) VALUES (3, 'track5', 'isrc5');
INSERT INTO tracks (artist_id, name, isrc) VALUES (3, 'track6', 'isrc6');
INSERT INTO tracks (artist_id, name, isrc) VALUES (4, 'track7', 'isrc7');



SELECT * FROM users;
SELECT * FROM artists;
SELECT * FROM tracks;


SELECT u.id as user_id, u.username, u.email, a.id as artist_id, a.tagline, t.name as trackname, t.isrc as track_isrc
FROM users u 
JOIN artists a ON u.id = a.user_id
LEFT JOIN tracks t ON a.id = t.artist_id;

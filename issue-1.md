# Coding Exercise: SQL


```sql

CREATE TABLE users (
	id serial PRIMARY KEY,
	username VARCHAR(50) UNIQUE NOT NULL,
	email VARCHAR(255) NOT NULL,
	created_at DATE NOT NULL,
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
```

Given the very basic database schema above:

- each artist may be associated with 0 or 1 user (aka not all users are artists)
- every track must be associated with an artist
- not every artist will have tracks

Write a query to return a list of users that are also artists, and their tracks:

- If an artist has multiple tracks, return one row per track
- If an artist does not have any tracks, still return the user and artist data but leave the track data blank


Your output should have the following columns:
```sql
+---------+----------+-------+-----------+---------+------------+------------+
| user_id | username | email | artist_id | tagline | track_name | track_isrc |
+---------+----------+-------+-----------+---------+------------+------------+
```
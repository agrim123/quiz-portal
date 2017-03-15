CREATE TABLE question(
	id SERIAL PRIMARY KEY,
	statement VARCHAR(1000) NOT NULL,
	correct_answer varchar(50) not null,
	image_url_1 varchar(100),
	image_url_2 varchar(100),
	image_url_3 varchar(100),
	image_url_4 varchar(100),
	image_url_5 varchar(100),
	hint varchar(1000),
	published_on timestamp default current_timestamp,
	question_number INT
);
CREATE TABLE "session" (
	"sid" varchar NOT NULL COLLATE "default",
	"sess" json NOT NULL,
	"expire" timestamp(6) NOT NULL
)
WITH (OIDS=FALSE);
ALTER TABLE "session" ADD CONSTRAINT "session_pkey" PRIMARY KEY ("sid") NOT DEFERRABLE INITIALLY IMMEDIATE;
CREATE TABLE users(
	id SERIAL PRIMARY KEY,
	username VARCHAR(100) NOT NULL,
	password varchar(80) not null,
	created_on timestamp default current_timestamp,
	score INT default 0,
	rol VARCHAR(10)
);
CREATE TABLE map_users(
	user_id INT,
	question_id INT,
	solved boolean default FALSE,
	FOREIGN KEY (user_id) REFERENCES users(id),
	FOREIGN KEY (question_id) REFERENCES question(id)
);
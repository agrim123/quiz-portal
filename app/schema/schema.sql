CREATE TABLE question(
	id SERIAL PRIMARY KEY,
	statement VARCHAR(500) NOT NULL,
	correct_answer varchar(50) not null,
	image_url varchar(100),
	published_on timestamp default current_timestamp,
	question_number INT,
	option_a VARCHAR(100),
	option_b VARCHAR(100),
	option_c VARCHAR(100),
	option_d VARCHAR(100)
);
CREATE TABLE "session" (
	"sid" varchar NOT NULL COLLATE "default",
	"sess" json NOT NULL,
	"expire" timestamp(6) NOT NULL
)
CREATE TABLE quiz_status (
	open boolean default FALSE
);
WITH (OIDS=FALSE);
ALTER TABLE "session" ADD CONSTRAINT "session_pkey" PRIMARY KEY ("sid") NOT DEFERRABLE INITIALLY IMMEDIATE;
CREATE TABLE users(	
	id SERIAL PRIMARY KEY,
	oauth_provider varchar(50),
	first_name varchar(50),
	last_name varchar(50),
	email varchar(100),
	gender varchar(5),
	picture varchar(255),
	score INT default 0,
	created_on timestamp default current_timestamp
 );
CREATE TABLE map_users(	
	user_id INT,
	question_id INT,
	solved boolean default FALSE,
	FOREIGN KEY (user_id) REFERENCES users(id),
	FOREIGN KEY (question_id) REFERENCES question(id)
);
CREATE TABLE solved_quiz(
	user_id INT UNIQUE,
	solved boolean default FALSE,
	FOREIGN KEY (user_id) REFERENCES users(id)
);


DECLARE @LoopCounter INT , @MaxEmployeeId INT, 
        @EmployeeName NVARCHAR(100)
SELECT @LoopCounter = min(id) , @MaxEmployeeId = max(Id) 
FROM #Employee
 
WHILE ( @LoopCounter IS NOT NULL
        AND  @LoopCounter <= @MaxEmployeeId)
BEGIN
   SELECT @EmployeeName = Name FROM #Employee 
   WHERE Id = @LoopCounter
   PRINT @EmployeeName  
   SELECT @LoopCounter  = min(id) FROM #Employee
   WHERE Id > @LoopCounter
END

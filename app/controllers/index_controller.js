var database = require('../models/database');
var fs = require("fs");
var posts= {};
var path = require('path');
exports.home = function(req,res){
	if(req.session.user){
		database.select_one('select status from quiz_status',true,function(result){
			if(result.status == 1){
				var user_id = req.session.user;
				var query = 'select * from map_users where user_id=${user_id} order by question_id';
				var data = {user_id:user_id};
				database.select(query,data,function(results){
					if(results.length > 0){
						/*var query = 'SELECT * from question left join map_users on question.id = map_users.question_id except select * from question right join map_users on question.id = map_users.question_id where user_id=${id} order by id desc limit 1';*/
						var query = 'select MAX(question_id) from map_users where user_id=${id}';
						database.select_one(query,{id: user_id},function(result){
							database.select_one('select * from question where id=${id}',{id: result.max+1},function(result){
								if(result === null){
									res.render('pages/index',{question: [], message: "<div class='banner'>You have completed the quiz! Please wait for quiz to complete and follow leaderboard</div>", cogniid: req.session.username});
								}else if(results.length > 0){
									res.render('pages/index',{question: result,message: '', cogniid: req.session.username});
								}else{
									res.render('pages/index',{question: [], message: "<div class='banner'>You have completed the quiz! Please wait for quiz to complete and follow leaderboard</div>", cogniid: req.session.username});
								}
							});
						});
					}else{
						var query = 'select * from question order by id limit 1';
						database.select_one(query,true,function(result){
							res.render('pages/index',{question: result, message: '',cogniid: req.session.username});
						});
					}
				});
			}else if(result.status == 0){
				res.render('pages/index',{question: [],message: 'Quiz has not yet started!',cogniid: req.session.username});
			}else{
				res.redirect('/login');
			}
		});
	}else{
		res.redirect('/login');
	}
}
exports.serve_file = function(req,res) {
	res.sendFile(path.resolve('./app/uploads/' + req.params.name.replace('.jpg','')));
}
exports.check = function(req,res){
	database.select_one('select status from quiz_status',true,function(result){
		if(result.status == 1){
			if(req.body.answer != '' && req.body.answer != null && req.body.answer != undefined){
				var user_id = req.session.user;
				var question_id = req.body.question_id;
				var query = 'select * from map_users where user_id=${user_id} and question_id=${question_id}';
				var data = {user_id:user_id,question_id: question_id};
				database.select(query,data,function(results){
					if(results.length > 0){
						res.writeHead(200, {'Content-Type': 'text/html'});
						res.end("201");
					}else{
						database.insert('INSERT INTO answers(user_id,answer) VALUES(${user_id},${answer})',{user_id: req.session.username, answer: req.body.answer});
						var query = 'select correct_answer from question where id=${id}';
						var data = {id: question_id};
						var map_data = {user_id: req.session.user,question_id:question_id,solved:true};
						database.select_one(query,data,function(results){
							if(results.correct_answer === req.body.answer){
								database.update('UPDATE users SET score=score+1 WHERE id=$1', [req.session.user]);
								database.insert('INSERT INTO map_users(user_id, question_id,solved) VALUES(${user_id}, ${question_id},${solved})', map_data);
								res.writeHead(200, {'Content-Type': 'text/html'});
								res.end("200");
							}else{
								res.writeHead(200, {'Content-Type': 'text/html'});
								res.end("204");
							}
						});
					}
				});
			}else if(req.body.answer.indexOf("'") < 0 || req.body.answer.indexOf("_") < 0){
				res.writeHead(200, {'Content-Type': 'text/html'});
				res.end("203");
			}else{
				res.writeHead(200, {'Content-Type': 'text/html'});
				res.end("202");
			}
		}else if(result.status == 0){
			res.writeHead(200, {'Content-Type': 'text/html'});
			res.end("205");
		}else{
			res.redirect('/login');
		}
	});
}
exports.leaderboard = function(req,res){
	var query = 'select score,username from users order by score desc limit 10';
	database.select(query,{user_id: req.session.user},function(results){
		res.setHeader('Content-Type', 'application/json');
		res.send(JSON.stringify(results));
	});
}

exports.wait = function(req,res){
	res.send('Quiz has ended or not yet started!');
}
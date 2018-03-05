var dotenv = require('dotenv');
var path = require('path')
dotenv.load();
var database = require('../models/database');
var fs = require("fs");
var posts= {};
exports.home = function(req,res){
	if(req.session.user){
		res.render('pages/home', {title: process.env.QUIZ_NAME});
	}else{
		res.render('pages/home', {title: process.env.QUIZ_NAME});
	}
}

exports.oth = function(req,res){
		res.render('pages/oth');
}

exports.serve_file = function(req,res) {
	console.log(path.resolve('./uploads/' + req.params.name.replace('.jpg','')));
	
	res.sendFile(path.resolve('./uploads/' + req.params.name.replace('.jpg','')))
}

exports.quiz = function(req,res){
	if(req.session.user){
		var user_id = req.session.user;
		var query = 'select solved from solved_quiz where user_id=${user_id}';
		var queryStatus = 'select open from quiz_status';
		var data = {user_id:user_id};
		database.select(queryStatus,data,function(result){
		console.log(result[0]);
			
		if(result[0] && !result[0].open) {
			res.render('pages/quiz',{questions: [],title: process.env.QUIZ_NAME,message: 'Quiz Has Not started or Ended'});
			return;
		}
		
		database.select(query,data,function(results){
			if(results.length > 0){
				res.render('pages/quiz',{questions: [], title: process.env.QUIZ_NAME,message: 'You have completed the quiz'});
			}else{
				var query = 'select id,statement,option_a,option_b,option_c,option_d,image_url from question';
				database.select(query,true,function(results){
					res.render('pages/quiz',{questions: results, title: process.env.QUIZ_NAME,message: ''});
				});
			}
		});
		});
	}else{
		res.redirect('/login');
	}
}

exports.check = function(req,res){
	var score = 0;
	if(req.session.user){
		var user_id = req.session.user;
		var data = { 
			user_id: user_id,
			solved: true
		};
		database.select_one('select * from solved_quiz where user_id=${user_id}',{user_id: user_id},function(result){
			if(result){
				res.end();
			}else if (req.body.length){
				var questions_id = [];
				for(i=0;i<req.body.length;i++){
					questions_id.push(req.body[i].question_id);
				}
				database.select('select id, correct_answer from question where id in ($1:csv)',[questions_id],function(result){
					var score = 0;
					for(i=0;i<result.length;i++){
						if(req.body[i].question_id == result[i].id){
							console.log(req.body[i].answer +' :::: '+ result[i].correct_answer)
							if(req.body[i].answer == result[i].correct_answer){
								score = score + 1;
							}else{
								score = score;
							}
						}
					}
					console.log(req.session.user + " :: "+score);
					database.insert('update users set score=$1 where id=$2',[score,req.session.user]);
					database.insert('INSERT INTO solved_quiz(user_id,solved) VALUES(${user_id},${solved})', {user_id: user_id,solved: true});
					res.sendStatus(200);	
					res.writeHead(200, {'Content-Type': 'text/html'});
					res.end();
					res.redirect('/quiz');	
				});
			}
			res.redirect('/quiz');
		});
		if(req.body.answer != '' && req.body.answer != null && req.body.answer != undefined){
			console.log(req.body[0].question_id);
			/*var query = 'select * from question where id=${id} and correct_answer=${correct_answer}';
			var data = {
				id: req.body[0].question_id;
				correct_answer: req.body[0].answer;
			}*/

		}else{
			res.writeHead(200, {'Content-Type': 'text/html'});
			res.end("202");
		}
	}else{
		res.end('Don\'t try to attack !!');
	}
}
exports.leaderboard = function(req,res){
	var query = 'select score,first_name,last_name from users order by score';
	database.select(query,true,function(results){
		res.render('pages/leaderboard',{users:results});
	});
}

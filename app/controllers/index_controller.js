var database = require('../models/database');
var fs = require("fs");
var posts= {};
exports.home = function(req,res){
	if(req.session.user){
		var user_id = req.session.user;
		var query = 'select solved from solved_quiz where user_id=${user_id}';
		var data = {user_id:user_id};
		database.select(query,data,function(results){
			if(results.length > 0){
				res.render('pages/index',{questions: [],message: 'You have completed the quiz'});
			}else{
				var query = 'select id,statement,option_a,option_b,option_c,option_d from question';
				database.select(query,true,function(results){
					res.render('pages/index',{questions: results,message: ''});
				});
			}
		});
	}else{
		res.redirect('/login');
	}
}
exports.check = function(req,res){
	if(req.session.user){
		var user_id = req.session.user;
		var data = { 
			user_id: user_id,
			solved: true
		};
		database.insert('INSERT INTO solved_quiz(user_id,solved) VALUES(${user_id},${solved})', data);			
		if(req.body.answer != '' && req.body.answer != null && req.body.answer != undefined){
			
		}else{
			res.writeHead(200, {'Content-Type': 'text/html'});
			res.end("202");
		}
	}else{
		res.send('Don\'t try to attack !!');
	}
}
exports.leaderboard = function(req,res){
	var query = 'select score,username from users order by score';
	database.select(query,true,function(results){
		res.setHeader('Content-Type', 'application/json');
		res.send(JSON.stringify(results));
	});
}
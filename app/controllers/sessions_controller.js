var database = require('../models/database');
var user_helper = require('../helpers/users_helper');
var database = require('../models/database');
exports.signup = function(req,res){
	if(req.session.user){
		res.redirect('/admin');
	}else{
		res.render('pages/signup', { title: 'Quiz'});
	}
}
exports.login = function(req,res){
	if(req.session.user){
		res.redirect('/');
	}else{
		res.render('pages/login',{title:'Kshitij',msg:""});
	}
}
exports.login_user = function(req,res){
	var query = 'SELECT * from users where username=${username}';
	var data = {username: req.body.username};
	database.select_one(query,data,function(user){
		if(user === null){
			res.render('pages/login',{msg: "You are not in kshitij family!!"});
		}else{
			if(user.password === user_helper.hashpassword(req.body.password.toString())){
				req.session.regenerate(function(){
					req.session.user = user.id;
					req.session.username = user.username;
					req.session.msg = 'Authenticated as '+ user.username;
					res.writeHead(302, {location: '/admin'});
					res.end();
				});
			}else{
				res.render('pages/login',{msg: "no no"});
			}
		}
	});
}
exports.logout = function(req,res){
	req.session.destroy(function(){
		res.redirect('/login');
	});
}
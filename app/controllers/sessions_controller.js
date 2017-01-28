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
	var userData = JSON.parse(req.body.userData);
	var query = 'SELECT * from users where email=$1';
	database.select_one(query,[userData.email],function(user){
		if(user === null){
			database.insertReturnOne('INSERT INTO users(oauth_provider,first_name,last_name,email,gender,picture,created_on) VALUES ($1,$2,$3,$4,$5,$6,$7) returning email',['facebook',userData.first_name,userData.last_name,userData.email,userData.gender,userData.picture.data.url,	new Date],function(result){
				database.select_one('SELECT * from users where email=$1',[userData.email],function(user){
					req.session.regenerate(function(){
						req.session.user = user.id;
						req.session.username = user.first_name + user.last_name;
						req.session.msg = 'Authenticated as '+ user.first_name;
						res.writeHead(302, {location: '/quiz'});
						res.end();
					});
				});
			});
			
		}else{
			req.session.regenerate(function(){
				req.session.user = user.id;
				req.session.username = user.username;
				req.session.msg = 'Authenticated as '+ user.username;
				res.writeHead(302, {location: '/quiz'});
				res.end();
			});
		}
	});
}
exports.logout = function(req,res){
	req.session.destroy(function(){
		res.redirect('/');
	});
}
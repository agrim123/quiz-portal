var dotenv = require('dotenv');
var request = require('request');
var pg = require('pg');

var database = require('../models/database');
var user_helper = require('../helpers/users_helper');
var database = require('../models/database');

dotenv.load();
exports.signup = function(req,res){
	if(req.session.user){
		res.redirect('/admin/dashboard');
	}else{
		res.render('pages/signup', { title: 'Quiz'});
	}
}
exports.login = function(req,res){
	if(req.session.user){
		res.redirect('/quiz');
	}else {
		res.render('pages/login',{title: process.env.QUIZ_NAME, msg:"", oth: false});
	}
}

exports.login_user = function(req,res) {
	let { hash } = req.body
	let { cogniId } = req.body
	if (cogniId && !hash) {
		var options = {
			url: `${process.env.CHECK_COGNI_ID}${req.body.cogniId}`,
			method: 'GET'
		}
		request(options, function (error, response, body) {
			console.log(error)
			if(error || !response) {
				console.log(error);
				res.render('pages/login',{
					msg: "Unknown error while logging in",
					title:process.env.QUIZ_NAME, 
					oth: false})
				return

				}
				console.log(response)
			let { message } = response.body
			let status = response.statusCode
			if (status === 200) {
				res.render('pages/login',{msg: '',
				oth: true,
				cogniId: req.body.cogniId,
				title: process.env.QUIZ_NAME,
			})
			} else {
				res.render('pages/login',{
					msg: response.body,
					oth: false,
					title: process.env.QUIZ_NAME,})
			}
		})
	} else if (cogniId && hash) {
		const body = {
			OTH: hash,
			id: cogniId,
		}
		var options = {
			url: `${process.env.API_DOMAIN}api/g/checkCogniIdandHash`,
			method: 'POST',
			form: body,
		}
		request(options, function (error, response, body) {
			if (error) {
				console.log(error, response, body);
				return
			}
			
			let { message } = response.body
			let status = response.statusCode
			if (status === 200) {
				var query = 'SELECT * from users where username=${username}'
				var data = {username: cogniId}
				database.select_one(query,data,function(user){
					console.log(user);
					
					if(user === null) {
						let date = new Date();
						const data = {
							username: cogniId,
							created_on:new Date,
							role: 'user',
							login_time: date.getTime(),
						}
						pg.connect(database.url, (err, client, done) => {
							if(err) {
								done()
								return res.status(500).json({success: false, data: err})
							}
							const query = client.query('INSERT INTO users(username,created_on,role, score, login_time) values($1, $2,$3,$4, $5) RETURNING id,username',
								[data.username,data.created_on,'user',0, data.login_time])
							query.on('end', (result) => {
								const a = result.rows[0]
								req.session.regenerate(function(){
									req.session.user = a.id
									req.session.username = a.username
									req.session.msg = 'Authenticated as '+ cogniId
									res.writeHead(302, {location: '/quiz'})
									res.end()
								})
								done()
							})
						})
					} else {
						let date = new Date();
						pg.connect(database.url, (err, client, done) => {
							if(err) {
								done()
								return res.status(500).json({success: false, data: err})
							}
							const query = client.query('UPDATE users SET login_time=$2 WHERE id=$1', [user.id,date.getTime()])
							query.on('end', (result) => {
								const a = result.rows[0]
								req.session.regenerate(function(){
									req.session.user = user.id
									req.session.username = user.username
									req.session.msg = 'Authenticated as '+ cogniId
									res.writeHead(302, {location: '/quiz'})
									res.end()
								})
								done()
							})
						})
					}
				})
			} else {
				res.render('pages/login',{msg: response.body, oth: false, title: process.env.QUIZ_NAME})
			}
		})
	}
}

exports.logout = function(req,res){
	req.session.destroy(function(){
		res.redirect('/login');
	});
}
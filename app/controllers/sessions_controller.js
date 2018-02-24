var request = require('request')
var dotenv = require('dotenv')
var pg = require('pg')
var database = require('../models/database')
var user_helper = require('../helpers/users_helper')
var database = require('../models/database')

dotenv.load()

exports.signup = function(req,res) {
	if(req.session.user){
		res.redirect('/admin')
	}else{
		res.render('pages/signup', { title: 'Cognizance IITR',message: ''})
	}
}

exports.login = function(req,res) {
	if(req.session.user){
		res.redirect('/')
	}else{
		res.render('pages/login',{title:'Cognizance IITR',msg:"", oth: false	})
	}
}

exports.login_user = function(req,res) {
	let { hash } = req.body
	let { cogniId } = req.body
	if (cogniId && !hash) {
		var options = {
			url: `${process.env.API_DOMAIN}api/checkCogniId/${req.body.cogniId}`,
			method: 'GET'
		}
		request(options, function (error, response, body) {
			let { message } = response.body
			let status = response.statusCode
			if (status === 200) {
				res.render('pages/login',{msg: '', oth: true, cogniId: req.body.cogniId})
			} else {
				res.render('pages/login',{msg: response.body, oth: false})
			}
		})
	} else if (cogniId && hash) {
		const body = {
			OTH: hash,
			id: cogniId,
		}
		var options = {
			url: `${process.env.API_DOMAIN}api/checkCogniIdandHash`,
			method: 'POST',
			form: body,
		}
		request(options, function (error, response, body) {
			let { message } = response.body
			let status = response.statusCode
			if (status === 200) {
				var query = 'SELECT * from users where username=${username}'
				var data = {username: cogniId}
				database.select_one(query,data,function(user){
					if(user === null){
						const data = {
							username: cogniId,
							onetimehash: hash,
							created_on:new Date,
							role: 'admin',
						}
						pg.connect(database.url, (err, client, done) => {
							if(err) {
								done()
								return res.status(500).json({success: false, data: err})
							}
							const query = client.query('INSERT INTO users(username, onetimehash,created_on,role) values($1, $2,$3,$4)',
								[data.username, data.onetimehash,data.created_on,'admin'])
							query.on('end', () => {
								done()
							})
						})
					}	else{
							req.session.regenerate(function(){
								req.session.user = user.id
								req.session.username = user.username
								req.session.msg = 'Authenticated as '+ cogniId
								res.writeHead(302, {location: '/'})
								res.end()
							})
					}
				})
			} else {
				res.render('pages/login',{msg: response.body, oth: false})
			}
		})
	}
}

exports.logout = function(req,res) {
	req.session.destroy(function(){
		res.redirect('/login')
	})
}

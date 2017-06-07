var pg = require('pg')
var user_helper = require('../helpers/users_helper')
var database = require('../models/database')
var request = require('request')
var dotenv = require('dotenv')
dotenv.load()

exports.create = function(req,res) {
	const data = {
		username:req.body.cogniid,
		password:user_helper.hashpassword(req.body.password),
		created_on:new Date
	}
	if(data.username.match('cogni')){
		var options = {
			url: process.env.COGNIID_CHECK_ROUTE + data.username,
			method: 'GET'
		}
		request(options, function (error, response, body) {
			if (!error && response.statusCode == 200) {
				if(body == 401){
					res.render('pages/signup',{message: 'Please provide a valid cogniId'})
				} else if(body == 200){
					database.select('select * from users where username=${username}',{username: req.body.cogniid},function(results){
						if(results.length){
							res.render('pages/signup',{message: 'You are already registered. Please login to continue.'})
						}else{
							pg.connect(database.url, (err, client, done) => {
								if(err) {
									done()
									console.log(err)
									return res.status(500).json({success: false, data: err})
								}
								const query = client.query('INSERT INTO users(username, password,created_on,role) values($1, $2,$3,$4)',
									[data.username, data.password,data.created_on,'user'])
								query.on('end', () => {
									done()
									res.redirect('/login')
								})
							})
						}
					})
				}else{
					res.render('pages/signup',{message: 'Something Unexpected happened. Please try after some time.'})
				}
			}
		})
	}else{
		res.render('pages/signup',{message: 'Please provide a valid cogniId'})
	}
}
var pg = require('pg');
var user_helper = require('../helpers/users_helper');
var database = require('../models/database');
exports.create = function(req,res){
	const data = { 
		username:req.body.cogniid,
		password:user_helper.hashpassword(req.body.password),
		created_on:new Date
	};
	console.log(data);
	console.log(data.username.match('cogni'));

	pg.connect(database.url, (err, client, done) => {
		if(err) {
			done();
			console.log(err);
			return res.status(500).json({success: false, data: err});
		}
		const query = client.query('INSERT INTO users(username, password,created_on) values($1, $2,$3)',
			[data.username, data.password,data.created_on]);
		query.on('end', () => { 
			done();	
			res.render('pages/login');
		});
	});
}
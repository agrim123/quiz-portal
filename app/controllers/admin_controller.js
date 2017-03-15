var database = require('../models/database');
var dotenv = require('dotenv');
dotenv.load();
var cloudinary = require('cloudinary');

var multer  = require('multer');
var storage = multer.diskStorage({
	destination: function (req, file, cb) {
		cb(null, 'app/uploads/')
	},
	filename: function (req, file, cb) {
		crypto.pseudoRandomBytes(16, function (err, raw) {
			cb(null, raw.toString('hex') + Date.now() + '.' + mime.extension(file.mimetype));
		});
	}
});
var upload = multer({ storage: storage });

var exec = require('child_process').exec;
exports.home = function(req,res){
	if(req.session.user){
		var query = 'SELECT role FROM users where id=${id}';
		database.select(query,{id: req.session.user},function(result){
			if(result[0].role === 'admin'){
				var query = 'SELECT * FROM question';
				database.select(query,true,function(results){
					res.render('pages/admin',{questions:results,message:''});
				});
			}else{
				res.redirect('/');
			}

		});
	}else{
		res.redirect('/login');
	}
}
exports.create_post = function(req,res){
	const results = [];
	if(req.body.statement == '' || req.body.correct_answer == '' || req.file == '') {
		var query = 'SELECT * FROM question';
		database.select(query,true,function(results){
			res.render('pages/admin',{ message:'Please fill all details', posts: results });
		});
	} else {
		console.log('in');
		var data = { 
			statement:req.body.statement,
			correct_answer:req.body.correct_answer,
			published_on:new Date,
			image_url: req.file.filename + '.jpg'
		};
		database.insert('INSERT INTO question(statement, correct_answer, published_on, image_url) VALUES(${statement},  ${correct_answer}, ${published_on}, ${image_url})', data); 
		res.redirect('/admin');
	}
}

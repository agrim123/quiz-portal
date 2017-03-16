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
}
exports.create_post = function(req,res){
	const results = [];
	if(req.body.statement == '' || req.body.correct_answer == '') {
		var query = 'SELECT * FROM question';
		database.select(query,true,function(results){
			res.render('pages/admin',{ message:'Please fill all details', posts: results });
		});
	} else {
		if(req.files){
			var images = ['none','none','none','none','none'];
			for (var i = req.files.length - 1; i >= 0; i--) {
				images[i] = req.files[i].filename + '.jpg';
			}
			var data = { 
				statement:req.body.statement,
				correct_answer:req.body.correct_answer,
				published_on:new Date,
				image_url_1:images[0],
				image_url_2:images[1],
				image_url_3:images[2],
				image_url_4:images[3],
				image_url_5:images[4],
				hint: req.body.hint
			};
			console.log(data);
			database.insert('INSERT INTO question(statement, correct_answer, published_on, image_url_1,image_url_2,image_url_3,image_url_4,image_url_5, hint) VALUES(${statement},  ${correct_answer}, ${published_on}, ${image_url_1},${image_url_2},${image_url_3},${image_url_4},${image_url_5}, ${hint})', data); 
			res.redirect('/admin');
		}else{
			var data = { 
				statement:req.body.statement,
				correct_answer:req.body.correct_answer,
				published_on:new Date,
				image_url_1:'',
				image_url_2:'',
				image_url_3:'',
				image_url_4:'',
				image_url_5:'',
				hint: req.body.hint
			};
			database.insert('INSERT INTO question(statement, correct_answer, published_on, image_url, hint) VALUES(${statement},  ${correct_answer}, ${published_on}, ${image_url}, ${hint})', data); 
			res.redirect('/admin');
		}
	}
}

exports.quiz_status = function(req,res){
	database.select_one('select * from quiz_status where user_id=${user_id}',{user_id: req.session.user},function(result){
		if(result){
			if(req.body.status == 'start'){
				database.update('UPDATE quiz_status SET status=1 WHERE user_id=$1', [req.session.user]);
				res.redirect('/admin');
			}else{
				database.update('UPDATE quiz_status SET status=0 WHERE user_id=$1', [req.session.user]);
				res.redirect('/admin');
			}
		}else{
			if(req.body.status == 'start'){
				database.insert('INSERT INTO quiz_status(user_id, status) VALUES(${user_id}, ${status})', {user_id: req.session.user, status: 1});
				res.redirect('/admin');
			}else{
				database.insert('INSERT INTO quiz_status(user_id, status) VALUES(${user_id}, ${status})', {user_id: req.session.user, status: 0});
				res.redirect('/admin');
			}
		}
	});
}
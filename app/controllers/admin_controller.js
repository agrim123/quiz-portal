var database = require('../models/database');
var dotenv = require('dotenv');
dotenv.load();
var cloudinary = require('cloudinary');
var multer  = require('multer')
var upload = multer({ dest: 'uploads/' });
cloudinary.config({ 
	cloud_name: process.env.CLOUD_NAME, 
	api_key: process.env.API_KEY, 
	api_secret: process.env.API_SECRET
});
var exec = require('child_process').exec;
exports.home = function(req,res){
	if(req.session.user){
		var query = 'SELECT * FROM question';
		database.select(query,true,function(results){
			res.render('pages/admin',{questions:results,message:''});
		});
	}else{
		res.redirect('/login');
	}
}
exports.start_quiz = function(req,res){
}
exports.end_quiz = function(req,res){
}
exports.create_post = function(req,res){
	const results = [];
	if(req.file){

		cloudinary.uploader.upload(req.file.path, function(result, error) {
			if (result) {
				var data = { 
					statement:req.body.statement,
					correct_answer:req.body.correct_answer,
					published_on:new Date,
					image_url: result.secure_url,
					option_a:req.body.option_a,
					option_b:req.body.option_b,
					option_c:req.body.option_c,
					option_d:req.body.option_d
				};
				database.insert('INSERT INTO question(statement, correct_answer,published_on,image_url,option_a,option_b,option_c,option_d) VALUES(${statement}, ${correct_answer},${published_on},${image_url},${option_a},${option_b},${option_c},${option_d})', data);
				exec('rm -rf app/uploads/*', function (err, stdout, stderr) {
					if (err) console.log(err);
					console.log(stderr);
					console.log(stdout);
				});
				res.redirect('/admin');
			}else {
				console.log(error);
			}
		});
	}else{
		var data = { 
			statement:req.body.statement,
			correct_answer:req.body.correct_answer,
			published_on:new Date,
			option_a:req.body.option_a,
			option_b:req.body.option_b,
			option_c:req.body.option_c,
			option_d:req.body.option_d
		};

		database.insert('INSERT INTO question(statement, correct_answer,published_on,option_a,option_b,option_c,option_d) VALUES(${statement}, ${correct_answer},${published_on},${option_a},${option_b},${option_c},${option_d})', data);
		
		res.redirect('/admin');
	}
}

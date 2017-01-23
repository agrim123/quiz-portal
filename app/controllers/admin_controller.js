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
exports.create_post = function(req,res){
	const results = [];
	if(req.file){
		cloudinary.uploader.upload(req.file.path, function(result, error) {
			if (result) {
				var data = { 
					statement:req.body.statement,
					correct_answer:req.body.correct_answer,
					published_on:new Date,
					image_url: result.secure_url
				};
				database.insert('INSERT INTO question(statement, correct_answer,image_url,published_on) VALUES(${statement}, ${correct_answer},${image_url},${published_on})', data,function(status){
					if(status){
						exec('rm -rf app/uploads/*', function (err, stdout, stderr) {
							if (err) console.log(err);
							console.log(stderr);
							console.log(stdout);
						});
						res.redirect('/admin');
					}
				});
			} else {
				console.log(error);
			}
		});
	}else{
		var data = { 
			statement:req.body.statement,
			correct_answer:req.body.correct_answer,
			published_on:new Date
		};
		database.insert('INSERT INTO question(statement, correct_answer,published_on) VALUES(${statement}, ${correct_answer},${published_on})', data,function(status){
			if(status){
				res.redirect('/admin');
			}
		});
	}
}

var database = require('../models/database');
var dotenv = require('dotenv');
dotenv.load();
var cloudinary = require('cloudinary');
cloudinary.config({ 
	cloud_name: process.env.CLOUD_NAME, 
	api_key: process.env.API_KEY, 
	api_secret: process.env.API_SECRET
});

var multer  = require('multer')
var storage = multer.diskStorage({
	destination: function (req, file, cb) {
		cb(null, 'uploads/')
	},
	filename: function (req, file, cb) {
		crypto.pseudoRandomBytes(16, function (err, raw) {
			cb(null, raw.toString('hex') + Date.now() + '.' + mime.extension(file.mimetype))
		})
	}
})

var upload = multer({ storage: storage })

var exec = require('child_process').exec

var exec = require('child_process').exec;
exports.home = function(req,res){
/*	if(req.session.user){*/
		var query = 'SELECT * FROM question';
		database.select(query,true,function(results){
			res.render('pages/admin',{questions:results,message:''});
		});
/*	}else{
		res.redirect('/login');
	}*/
}

exports.create_post = function(req,res){
	const results = [];
	console.log(req.files, req.file, '----------------------------------');
	if(req.file){
		console.log(req.file);
		
			var image = req.file.filename + '.jpg'
			console.log(image);
				var data = { 
					statement:req.body.statement,
					correct_answer:req.body.correct_answer,
					published_on:new Date,
					image_url: image,
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
				res.redirect('/admin/dashboard');
	}else{
		console.log('images not found');
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
		
		res.redirect('/admin/dashboard');
	}
}


exports.quiz_status = function(req,res) {
	database.select_one('select open from quiz_status',{user_id: req.session.user},function(result){
		if(result){
			console.log(result.open);
			
			if(req.body.status == 'start'){
				let date = new Date();
				database.update('UPDATE quiz_status SET open=true WHERE open=$1', false)
				database.update('update users set login_time = $1', [date.getTime()])
				res.redirect('/admin/dashboard')
			} else {
				database.update('UPDATE quiz_status SET open=false WHERE open=$1', true)
				res.redirect('/admin/dashboard')
			}
		} else {
			if(req.body.status == 'start'){
				database.insert('INSERT INTO quiz_status(open) VALUES(${open})', { open: true })
				database.update('update users set login_time = $1', [date.getTime()])
				res.redirect('/admin/dashboard')
			}else{
				database.insert('INSERT INTO quiz_status(open) VALUES(${open})', { open: false})
				res.redirect('/admin/dashboard')
			}
		}
	})
}